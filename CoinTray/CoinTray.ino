#define SERVER      "192.168.2.1"
#define PORT_NUM    3000

#define EVAL_COUNT          7
#define BET_THREATHHOLD     100
#define DROP_THREATHHOLD    300

// coin weight
int tray1 = A4;
int tray2 = A1;

unsigned int start_flg, start1_flg, start2_flg;
unsigned int end1_flg, end2_flg;
unsigned int tray1_raw, tray2_raw;
unsigned int tray1_cur, tray2_cur;
unsigned int bet1_state, bet2_state;
unsigned int drop1_state, drop2_state;

// http
TCPClient tcp;
byte server[] = { 192, 168, 2, 1 };
//byte server[] = { 74, 125, 224, 72 }; // Google

void setup()
{
	Serial1.begin(9600);

	pin_setup();
	game_setup();

	Serial1.println("Setup done.");
	delay(1000);
}


void loop()
{
	pin_loop();
	delay(200);
}

void pin_setup(void)
{
	pinMode(tray1, INPUT);
	pinMode(tray2, INPUT);
	tray1_raw = analogRead(tray1);
	tray2_raw = analogRead(tray2);
}

void game_setup(void)
{
	start_flg = 0;
	start1_flg = 0;
	start2_flg = 0;
	end1_flg = 0;
	end2_flg = 0;
	bet1_state = 0;
	bet2_state = 0;
	drop1_state = 0;
	drop2_state = 0;
	tray1_cur = tray1_raw;
	tray2_cur = tray2_raw;
}

void http_get(char *url)
{
	if (tcp.connect(server, PORT_NUM)) {
		//Serial1.println("connected");
		
		tcp.print("GET ");
		tcp.print(url);
		tcp.println(" HTTP/1.0");
		
		tcp.print("Host: ");
		tcp.print(SERVER);
		tcp.print(":");
		tcp.println(PORT_NUM);
		
		tcp.println("Content-Length: 0");
		tcp.println();
	} else {
		Serial1.println("connection failed");
	}

	if (tcp.available()) {
		char c = tcp.read();
		Serial1.print(c);
	}

	//if (!tcp.connected()) {
	//    Serial1.println();
	//    Serial1.println("disconnecting.");
		tcp.stop();
	//}
}

void pin_loop(void)
{
	// Analog read
	tray1_raw = analogRead(tray1);
	tray2_raw = analogRead(tray2);

	// Action {Restart: 1}
	if ((start1_flg == 0) || (start2_flg == 0)) {
		if (tray1_raw < tray1_cur - BET_THREATHHOLD) {
			if (bet1_state < EVAL_COUNT) {
				++bet1_state;
			} else {
				Serial1.print("start1: ");
				Serial1.println(tray1_raw);
				tray1_cur = tray1_raw;
				bet1_state = 0;
				start1_flg = 1;
			}
		} else if (tray2_raw < tray2_cur - BET_THREATHHOLD) {
			if (bet2_state < EVAL_COUNT) {
				++bet2_state;
			} else {
				Serial1.print("start2: ");
				Serial1.println(tray2_raw);
				tray2_cur = tray2_raw;
				bet2_state = 0;
				start2_flg = 1;
			}
		}
		return;
	} else {
		if (start_flg == 0) {
			Serial1.println("Game start.");
			http_get("/tray/restart");
			start_flg = 1;
		}
	}

	// Action {end: 1}
	if ((end1_flg == 1) && (end2_flg == 1)) {
		Serial1.println("Game end.");
		http_get("/tray/restart");
		game_setup();
		return;
	}

	// Action {Bet: tray1}
	if (tray1_raw < tray1_cur - BET_THREATHHOLD) {
		if (bet1_state < EVAL_COUNT) {
			++bet1_state;
		} else {
			http_get("/tray/p1/bet");
			Serial1.print("bet1: ");
			Serial1.println(tray1_raw);
			tray1_cur = tray1_raw;
			bet1_state = 0;
		}
	}
	// Action {Bet: tray2}
	else if (tray2_raw < tray2_cur - BET_THREATHHOLD) {
		if (bet2_state < EVAL_COUNT) {
			++bet2_state;
		} else {
			http_get("/tray/p2/bet");
			Serial1.print("bet2: ");
			Serial1.println(tray2_raw);
			tray2_cur = tray2_raw;
			bet2_state = 0;
		}
	}
	// Action {Drop: tray1}
	else if (tray1_raw > tray1_cur + DROP_THREATHHOLD) {
		if (drop1_state < EVAL_COUNT) {
			++drop1_state;
		} else {
			http_get("/tray/p1/drop");
			Serial1.print("drop1: ");
			Serial1.println(tray1_raw);
			tray1_cur = tray1_raw;
			drop1_state = 0;

			end1_flg = 1;
		}
	}
	// Action {Drop: tray2}
	else if (tray2_raw > tray2_cur + DROP_THREATHHOLD) {
		if (drop2_state < EVAL_COUNT) {
			++drop2_state;
		} else {
			http_get("/tray/p2/drop");
			Serial1.print("drop2: ");
			Serial1.println(tray2_raw);
			tray2_cur = tray2_raw;
			drop2_state = 0;

			end2_flg = 1;
		}
	}
}

