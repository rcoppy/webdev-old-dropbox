//define global variables

int sizeX = 384; 
int sizeY = 288; 

Ball freddy; // here's our instance of the ball class

//set up the canvas
void setup() { 
    size(sizeX,sizeY); 
  freddy = new Ball(30,30); // initialize the ball
}

//draw to the screen. This will happen at least 30 times every second.
void draw() { 
    //refresh the screen
  fill(0,0,0);
  rect(0,0,sizeX,sizeY);   
  freddy.draw(); 
}

//ball class
class Ball { 
  // variables 
  int x = 0; 
  int y = 0; 

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
  
    //bounce the ball and change its color
    updatePosition(); 
    updateColor(); 
  }
  
  // draw 
  void draw() { 
    update(); 
    //draw the ball
    fill(r,g,b); 
    ellipse(x,y,60,60);
  }
  
  //change the balls color 
  void updateColor() { 
    r += 20; 
    g += 10; 
    b -= 50; 
  
    if (r > 255) {
      r = 0; 
    }
    if (g > 255) { 
      g = 0; 
    }
    if (b < 0) { 
      b = 255; 
    }
  
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
}

