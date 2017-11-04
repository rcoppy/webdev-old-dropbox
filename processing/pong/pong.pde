/// Pong clone with "intelligent" AI.

// global variables
Ball ball; 
Bat bat; 
Bat bat2;
int sizeX = 480;  
int sizeY = 320; 

// setup event
void setup() { 
  size(sizeX,sizeY); 
  ball = new Ball(sizeX/2,sizeY/2); 
  bat = new Bat(64,0,ball); 
  bat2 = new Bat(sizeX-64,sizeY,ball); 
}

// update event
void update() { 
  // called from draw
  ball.update();
  bat.update(); 
  bat2.update(); 
}

// draw event
void draw() { 
  background(0,0,0); 
  // draw everything
  ball.draw();
  bat.draw(); 
  bat2.draw();
}

//ball class
class Ball { 
  // variables 
  int x = 200; 
  int y = 200; 

  int r = 125; 
  int g = 20; 
  int b = 255; 

  int xspeed = int(random(20)); // int() rounds random(20) to integer
  int yspeed = int(random(20)); 
  
  // constructor
  Ball(int xx, int yy) {
    x = xx;
    y = yy; 
  }
  
  // update
  void update() { 
    //update x,y coordinates
    x += xspeed; 
    y += yspeed; 
  
    //bounce the ball 
    updatePosition();  
  }
  
  // draw 
  void draw() { 
    update(); 
    //draw the ball
    fill(r,g,b); 
    ellipse(x,y,60,60);
  }

  //check to see if the ball should bounce
  void updatePosition() {
    if (x < 0) {
      x = 0;
      xspeed *= -1;
    }
    if (x > sizeX) { 
      x = sizeX; 
      xspeed *= -1;
    }
    if (y < 0) {
      y = 0;
      yspeed *= -1; 
    }
    if (y > sizeY) {
      y = sizeY;
      yspeed *= -1;
    }
  }
  
  boolean collisionCheck(int x1, int x2, int y1, int y2) { 
    int r = 30; 
    if (sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) < 60) {
      return true; 
    }
    return false;
  }
}
// bat class
class Bat { 
  // variables
  int x;
  int y;  
  int yspeed = 4;
  Ball ball; 
  
  // constructor
  Bat(int x, int y, Ball ball) {
    this.x = x;
    this.y = y; 
    this.ball = ball; 
  }
  
  // methods
  void update() { 
    if (y < ball.y) {
      y += yspeed;
    }
    if (y > ball.y) {
      y -= yspeed;
    }
  }
  
  void draw() { 
    update(); 
    //draw the ball
    fill(255,255,0); 
    rect(x-12,y+12,24,64);
  }
  
}

