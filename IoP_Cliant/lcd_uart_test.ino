#include <doxygen.h>
#include <ESP8266.h>

//ESP用のマクロ
//#define SSID "YOUR SSID"
//#define PASSWORD "YOUR PASSWORD"
//#define HOST_NAME "YOUR HOSTNAME"
//#define HOST_PORT "YOUR HOSTPORT"
#include "INFO.h"

#include <Adafruit_GFX.h>    // Core graphics library
#include <Adafruit_TFTLCD.h> // Hardware-specific library 機種依存のライブラリ


//ピンアサインメントのためのマクロ
#define LCD_CS A3 // Chip Select goes to Analog 3
#define LCD_CD A2 // Command/Data goes to Analog 2
#define LCD_WR A1 // LCD Write goes to Analog 1
#define LCD_RD A0 // LCD Read goes to Analog 0

#define LCD_RESET A4 // Can alternately just connect to Arduino's reset pin　リセット

//色をわかりやすく表記するためのマクロ
#define BLACK   0x0000
#define BLUE    0x001F
#define RED     0xF800
#define GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF
#define ORANGE  0xF944

Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);
//カード表示用の変数
float halfCharSizeX = 5 / 2; //標準の文字が一文字で取る幅の大きさの半分
float halfCharSizeY = 7 / 2; //標準の文字が一文字で取る縦の大きさの半分
int textSize = 5;

String data;
char *message = "GET /card HTTP/1.1\r\nConnection: keep-alive\r\n\r\n";
char character;
int suits, lastSuits, number, lastNumber = 0;
//描画後はtrue
boolean isDrawn;

ESP8266 wifi(Serial);

void setup() {
  Serial.begin(9600);
  tft.reset();
  uint16_t identifier = tft.readID();
  tft.begin(identifier);
  tft.setRotation(1);
  // ここで描画メソッドを呼び出す。
  tft.fillScreen(BLACK);
  tft.setTextColor(WHITE);
  setupConnection();
  connectTCP();
  sendRequest();
}

void loop() {
  while (Serial.available() > 0) {
    character = Serial.read();
    data += character;
    if (isDrawn != true) {
      tft.print(character);
    }
    if (character == '}' && data.charAt(2) == ',') {
      //    自分が}→送信したいデータの最後
      //    dataの中にはカードの情報が全て入っている状態
      suits = (int) data.charAt(1) - '0';
      if (data.charAt(5) == '}' && data.charAt(3) == '1') {
        //        二桁
//        tft.println("in if");
        number = 10 + (int) data.charAt(4) - '0';
      } else {
        //        一桁
        number = (int) data.charAt(3) - '0';
      }
      data = "";
      //      カードの情報を出力, 更新確認
      drawCard(suits, number);
      checkUpdate();
    }
    if (character == '\n') {
      //改行を検出

      if (data.indexOf("CLOSED") != -1) {
        //        tcp接続が切れた際に再接続
        connectTCP();
        sendRequest();
      }
      data = "";
    }
    if (character == '>') {
      if(isDrawn != true) {
      tft.fillScreen(BLACK);
      tft.setCursor(0, 0);
    }
      Serial.print(message);
    }
  }
}

void setupConnection() {
  while (1) {
    if (wifi.setOprToStationSoftAP()) {
      tft.print(F("to station + softap ok\r\n"));
      break;
    } else {
      tft.print(F("to station + softap err\r\n"));
    }
  }
  while (1) {
    if (wifi.joinAP(SSID, PASSWORD)) {
      tft.print(F("Join AP success\r\n"));
      tft.println(F("IP:"));
      tft.println( wifi.getLocalIP().c_str());
      break;
    } else {
      tft.println(F("Join AP failure\r\n"));
    }
  }
  while (1) {
    if (wifi.disableMUX()) {
      tft.print(F("single ok\r\n"));
      break;
    } else {
      tft.print("single err\r\n");
    }
    tft.print("setup end\r\n");
  }
}

void connectTCP() {
  while (1) {
    if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
      if (isDrawn != true) {
        tft.print("create tcp ok\r\n");
      }
      break;
    } else {
      if (isDrawn != true) {
        //デバッグ用の表示
        tft.print("create tcp err\r\n");
        tft.fillScreen(BLACK);
        tft.setCursor(0, 0);
        tft.println(wifi.getIPStatus());
      }
//      if (wifi.getIPStatus() == "STATUS:4") {
//        //wifiから切断している場合。
//        setupConnection();
//      }
    }
  }
}

void sendRequest() {
  //以下の文字列を、SerialでのHTTP通信の前に予め送っておく
  Serial.print(F("AT+CIPSEND="));
  Serial.println(strlen(message));
}

void checkUpdate() {
  //  isDrawn = false;
  //  closeTCP();
  //  setupConnection();
  //  connectTCP();

  //   if(wifi.getIPStatus() == "STATUS: 5") {
  //      setupConnection();
  //        connectTCP();
  //     }
  delay (5000);
  sendRequest();
}

void closeTCP() {
  while (1) {
    if (wifi.releaseTCP()) {
      tft.println("release tcp ok\r\n");
      break;
    } else {
      tft.println("release tcp err\r\n");
    }
  }
}

//suits
//0 : diamond
//1 : heart
//2 : spade
//3 : club
void drawCard(int cardSuits, int cardNum) {
  if (compInt(lastSuits, suits) != true && compInt(lastNumber, number) != true) {
//  if(false) {
    //カードが変化していた場合
    isDrawn = true;
    tft.setRotation(0);
    tft.fillScreen(WHITE);

    switch (cardSuits) {
      case 0:
        diamond();
        break;
      case 1:
        heart();
        break;
      case 2:
        spade();
        break;
      case 3:
        club();
        break;
    }
    lastSuits = cardSuits;
    lastNumber = cardNum;
    drawNum(cardNum);
  } else {
    //前と同じカードだった場合
  }
}

void diamond() {
  tft.fillTriangle(tft.width() / 2, 0, 0, tft.height() / 2, tft.width(), tft.height() / 2, RED);
  tft.fillTriangle(0, tft.height() / 2, tft.width() / 2, tft.height(), tft.width(), tft.height() / 2, RED);
}

void heart() {
  tft.fillTriangle(0, tft.height() / 8, tft.width(), tft.height() / 8, tft.width() / 2, 7 * tft.height() / 8, RED);
  tft.fillTriangle(tft.width() / 4, tft.height() / 8, 3 * tft.width() / 4, tft.height() / 8, tft.width() / 2, 2 * tft.height() / 8, WHITE);
}

void spade() {
  tft.fillTriangle(tft.width() / 2, 0, 0, 5 * tft.height() / 8, tft.width(), 5 * tft.height() / 8, BLACK);
  tft.fillTriangle(tft.width() / 2, tft.height() / 2, 2 * tft.width() / 7, tft.height(), 5 * tft.width() / 7, tft.height(), BLACK);
}

void club() {
  tft.fillCircle(tft.width() / 2, 80, 60, BLACK);
  tft.fillCircle(tft.width() / 4, 150, 60, BLACK);
  tft.fillCircle(3 * tft.width() / 4, 150, 60, BLACK);
  tft.fillTriangle(tft.width() / 2, 90, 2 * tft.width() / 7, tft.height(), 5 * tft.width() / 7, tft.height(), BLACK);
}

void drawNum(int num) {
  String numStr = String(num);
  tft.setTextColor(WHITE);
  tft.setTextSize(textSize);
  if (numStr.length() == 1) {
    tft.setCursor((tft.width() / 2) - (textSize * halfCharSizeX), (tft.height() / 2) - (textSize * halfCharSizeY));
  } else if (numStr.length() == 2) {
    tft.setCursor((tft.width() / 2) - (10 + textSize * halfCharSizeX * 2), (tft.height() / 2) - (textSize * halfCharSizeY));
  }
  tft.print(num);
}

//便利
int compInt(int a, int b) {
  return a == b;
}

