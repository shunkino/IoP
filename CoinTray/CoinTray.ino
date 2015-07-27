// server settings
#define SERVER      "10.10.10.1"
#define PORT_NUM    3000
#define PLAYER      "p1"      // player1

// analog input
int tray1 = A4;
int tray2 = A1;
int raw_tray1 = 0;
int raw_tray2 = 0;

// http setting
TCPClient tcp;
byte server[] = { 10, 10, 10, 1 };
//byte server[] = { 74, 125, 224, 72 }; // Google


void setup()
{
    Serial1.begin(9600);
    pinMode(tray1, INPUT);
    pinMode(tray2, INPUT);

    http_setup();
}

void loop()
{
    //pin_loop();
    http_loop();
    
    //delay(1000);
}

void pin_loop(void)
{
    raw_tray1 = analogRead(tray1);
    raw_tray2 = analogRead(tray2);
    
    Serial1.println("raw_tray1: ");
    Serial1.println(raw_tray1);
    Serial1.println("raw_tray2: ");
    Serial1.println(raw_tray2);
}

void http_setup(void)
{
    if (tcp.connect(server, PORT_NUM)) {
        Serial1.println("connected");
        tcp.println("PUT /tray HTTP/1.0");
        //tcp.println("Host: www.google.com");
        tcp.println("Host: " SERVER ":3000");
        tcp.println("Content-Length: 0");
        tcp.println();
    } else {
        Serial1.println("connection failed");
    }
}

void http_loop(void)
{
    if (tcp.available()) {
        char c = tcp.read();
        Serial1.print(c);
    }

    if (!tcp.connected()) {
        Serial1.println();
        Serial1.println("disconnecting.");
        tcp.stop();
        for(;;);
    }
}

