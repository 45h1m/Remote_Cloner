#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>

#include <IRsend.h>
// receive
#include <Arduino.h>
#include <IRremoteESP8266.h>
#include <IRrecv.h>
#include <IRutils.h>

#include "html.h"

#ifdef ARDUINO_ESP32C3_DEV
const uint16_t kRecvPin = 10;  // 14 on a ESP32-C3 causes a boot loop.
#else                          // ARDUINO_ESP32C3_DEV
const uint16_t kRecvPin = 14;  // D5 on esp8266
#endif                         // ARDUINO_ESP32C3_DEV


const unsigned int MAX_MSG_LENGTH = 8;

// IR send pin
const uint16_t kIrLed = 4;  // D2 on esp8266


const byte DNS_PORT = 53;
IPAddress apIP(172, 217, 28, 1);
DNSServer dnsServer;

IRrecv irrecv(kRecvPin);
// IR send
IRsend irsend(kIrLed);

decode_results results;

// end receive

#define PORT 80

ESP8266WebServer webServer(PORT);
WebSocketsServer webSocket = WebSocketsServer(81);

String responseHTML = ""
                      "<!DOCTYPE html><html lang='en'><head>"
                      "<meta name='viewport' content='width=device-width'>"
                      "<title>CaptivePortal</title></head><body>"
                      "<h1>Hello World!</h1><p>This is a captive portal example."
                      " All requests will be redirected here.</p></body></html>";


void initIRReceive() {
  irrecv.enableIRIn();  // Start the receiver
  while (!Serial)       // Wait for the serial connection to be establised.
    delay(50);
  Serial.println();
  Serial.print("IRrecvDemo is now running and waiting for IR message on Pin ");
  Serial.println(kRecvPin);
}


void initIRSend() {
  irsend.begin();
#if ESP8266
  Serial.begin(115200, SERIAL_8N1, SERIAL_TX_ONLY);
#else   // ESP8266
  Serial.begin(115200, SERIAL_8N1);
#endif  // ESP8266
}



void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);

      break;

    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        if (num != 0) webSocket.disconnect(num);

        webSocket.broadcastTXT("Hello From ESP");
      }
      break;

    case WStype_TEXT:
      {

        Serial.printf("[%u] get Text: %s\n", num, payload);

        String msg = (const char *)payload;
        // Dereference and get the integer value
        Serial.println(msg);

        char event = msg.charAt(0);
        Serial.println(event);

        if (event == 'T') {

          String hexStr = msg.substring(1, 9);
          Serial.println(hexStr);
          unsigned long irCode = strtoul(hexStr.c_str(), NULL, 16);
          irsend.sendNEC(irCode, 32);
        }




        // webSocket.broadcastTXT("message here");
      }

    case WStype_BIN:
      Serial.printf("[%u] get binary length: %u\n", num, length);
      hexdump(payload, length);
      // send message to client
      // webSocket.sendBIN(num, payload, length);
      break;
  }
}

void handleCommand() {

  while (Serial.available() > 0) {

    static char msg[MAX_MSG_LENGTH];
    static unsigned int pos = 0;

    char c = Serial.read();

    if (c != '\n' && (pos - MAX_MSG_LENGTH - 1)) {
      msg[pos] = c;
      pos++;

    } else {
      msg[pos] = '\0';
      pos = 0;

      unsigned long irData = strtoul(msg, NULL, 16);

      Serial.println(msg);

      irsend.sendNEC(irData, 2);
    }
  }
}


void receiveIR() {
  if (irrecv.decode(&results)) {
    // print() & println() can't handle printing long longs. (uint64_t)
    serialPrintUint64(results.value, HEX);
    String hexValue = "RX" + String(results.value, HEX);
    webSocket.broadcastTXT(hexValue);
    Serial.println("");
    irrecv.resume();  // Receive the next value
  }
}



void setup() {
  Serial.begin(115200);

  delay(100);

  initIRSend();
  Serial.println("IR Send ready");
  delay(100);

  initIRReceive();
  Serial.println("IR Receive ready");
  delay(100);

  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP("ANGRY REMOTE");

  dnsServer.start(DNS_PORT, "*", apIP);


  webServer.onNotFound([]() {
    webServer.send(200, "text/html", INDEX_HTML);
  });

  webServer.begin();

  Serial.println("Web server started");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("Web socket server started");
}

void loop() {
  dnsServer.processNextRequest();
  webServer.handleClient();
  webSocket.loop();
  receiveIR();
  if (Serial.available() > 0) {
    handleCommand();
  }
}