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
#include "PinDefinitionsAndMore.h"
#include <IRremote.hpp>

#if !defined(RAW_BUFFER_LENGTH)
#if RAMEND <= 0x4FF || RAMSIZE < 0x4FF
#define RAW_BUFFER_LENGTH 180  // 750 (600 if we have only 2k RAM) is the value for air condition remotes. Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.
#elif RAMEND <= 0x8FF || RAMSIZE < 0x8FF
#define RAW_BUFFER_LENGTH 600  // 750 (600 if we have only 2k RAM) is the value for air condition remotes. Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.
#else
#define RAW_BUFFER_LENGTH 750  // 750 (600 if we have only 2k RAM) is the value for air condition remotes. Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.
#endif
#endif

#define MARK_EXCESS_MICROS 20  // Adapt it to your IR receiver module. 20 is recommended for the cheap VS1838 modules.

#define RECORD_GAP_MICROS 12000  // Default is 5000. Activate it for some LG air conditioner protocols
#define DEBUG   


#define IR_RECEIVE_PIN 10
#define IR_LED_PIN 14

const unsigned int MAX_MSG_LENGTH = 8;

const uint16_t kRecvPin = IR_RECEIVE_PIN;  // 14 on a ESP32-C3 causes a boot loop.


// IR send pin
const uint16_t kIrLed = IR_LED_PIN; // D2 on esp8266


const byte DNS_PORT = 53;
IPAddress apIP(172, 217, 28, 1);
DNSServer dnsServer;

IRrecv irrecv(kRecvPin);
// IR send 
IRsend irsend(kIrLed); 

decode_results results;

// end receive

#define PORT 80

ESP8266WebServer    webServer(PORT);
WebSocketsServer    webSocket = WebSocketsServer(81);

String responseHTML = ""
                      "<!DOCTYPE html><html lang='en'><head>"
                      "<meta name='viewport' content='width=device-width'>"
                      "<title>CaptivePortal</title></head><body>"
                      "<h1>Hello World!</h1><p>This is a captive portal example."
                      " All requests will be redirected here.</p></body></html>";


void initIRReceive(){
  irrecv.enableIRIn();  // Start the receiver
  while (!Serial)  // Wait for the serial connection to be establised.
    delay(50);
  Serial.println();
  Serial.print("IRrecvDemo is now running and waiting for IR message on Pin ");
  Serial.println(kRecvPin);
}


void initIRSend() {
    irsend.begin();
#if ESP8266
  Serial.begin(115200, SERIAL_8N1, SERIAL_TX_ONLY);
#else  // ESP8266
  Serial.begin(115200, SERIAL_8N1);
#endif  // ESP8266
}



void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      
      break;

    case WStype_CONNECTED: {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
        
        if(num != 0) webSocket.disconnect(num);

        webSocket.broadcastTXT("Hello From ESP");
      }
      break;

    case WStype_TEXT:{

      Serial.printf("[%u] get Text: %s\n", num, payload);

      String msg = (const char *) payload;
      // Dereference and get the integer value
      Serial.println(msg);

      char event = msg.charAt(0);
      Serial.println(event);

      if(event == 'T') {

        String hexStr = msg.substring(1,6);
        Serial.println(hexStr);
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


void receiveIR() {
  if (irrecv.decode(&results)) {
    // print() & println() can't handle printing long longs. (uint64_t)
    serialPrintUint64(results.value, HEX);
    char hexString[17];
    sprintf(hexString, "%016IIX");
    String hexValue = "RX" + String(hexString);
    webSocket.broadcastTXT(hexValue);
    Serial.println("");
    irrecv.resume();  // Receive the next value
  }
}


void irDump() {

  Serial.println("IR DUMP");

  IrReceiver.printIRResultShort(&Serial);

  if (IrReceiver.decodedIRData.protocol == UNKNOWN)
    Serial.println(F("Received noise or an unknown (or not yet enabled) protocol"));

  Serial.println();
  IrReceiver.printIRSendUsage(&Serial);
  Serial.println();
  Serial.println(F("Raw result in internal ticks (50 us) - with leading gap"));
  IrReceiver.printIRResultRawFormatted(&Serial, false);  // Output the results in RAW format
  Serial.println(F("Raw result in microseconds - with leading gap"));
  IrReceiver.printIRResultRawFormatted(&Serial, true);  // Output the results in RAW format
  Serial.println();                                     // blank line between entries
  Serial.print(F("Result as internal 8bit ticks (50 us) array - compensated with MARK_EXCESS_MICROS="));
  Serial.println(MARK_EXCESS_MICROS);
  IrReceiver.compensateAndPrintIRResultAsCArray(&Serial, false);  // Output the results as uint8_t source code array of ticks
  Serial.print(F("Result as microseconds array - compensated with MARK_EXCESS_MICROS="));
  Serial.println(MARK_EXCESS_MICROS);
  IrReceiver.compensateAndPrintIRResultAsCArray(&Serial, true);  // Output the results as uint16_t source code array of micros
  IrReceiver.printIRResultAsCVariables(&Serial);                 // Output address and data as source code variables

  Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX);
}



void sendHEX2Serial() {
  String hex = String(IrReceiver.decodedIRData.decodedRawData, HEX);
  Serial.println(">>" + hex + "<<");
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

      IrSender.sendNECRaw(irData, 2);
    }
  }
}



void setup() {
  Serial.begin(115200);

  delay(100);

  Serial.println(F("START " __FILE__ " from " __DATE__ "\r\nUsing library version " VERSION_IRREMOTE));

  // Start the receiver and if not 3. parameter specified, take LED_BUILTIN pin from the internal boards definition as default feedback LED
  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
  IrSender.begin(IR_LED_PIN);

  Serial.print(F("Ready to receive and send IR signals of protocols: "));
  printActiveIRProtocols(&Serial);
  Serial.println(F("at pin " STR(IR_RECEIVE_PIN)));

  // infos for receive
  Serial.print(RECORD_GAP_MICROS);
  Serial.println(F(" us is the (minimum) gap, after which the start of a new IR packet is assumed"));
  Serial.print(MARK_EXCESS_MICROS);
  Serial.println();
  Serial.println(F("Because of the verbose output (>200 ms at 115200), repeats are probably not dumped correctly!"));
  Serial.println();

  // initIRSend();
  // Serial.println("IR Send ready");
  // delay(100);

  // initIRReceive();
  // Serial.println("IR Receive ready");
  // delay(100);

  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP("ANGRY REMOTE");

  dnsServer.start(DNS_PORT, "*", apIP);


  webServer.onNotFound([]() {
    webServer.send(200, "text/html", responseHTML);
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
}