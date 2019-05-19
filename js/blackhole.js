//学习 https://github.com/whxaxes/canvas-test/tree/master/src/Particle-demo/blackhole

function blackhole(){
  var particles = [];
  var blackholes = [];
  var BH_SIZE = 30;
  var BH_DETORY_SIZE = 80;

  var container = document.getElementById('blackhole');
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  container.appendChild(canvas);

  var bufCanvas = document.createElement('canvas');
  var bufContext = bufCanvas.getContext('2d');

  function resize() {
    bufCanvas.width = canvas.width = container.offsetWidth;
    bufCanvas.height = canvas.height = container.offsetHeight;
  };
  window.onresize = resize;
  resize();

  // 动画循环封装
  var RAF = (function() {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) { window.setTimeout(callback, 1000 / 60); }
  })();

  // 预渲染黑洞图片
  var bhImage = (function() {
    var bhCanvas = document.createElement('canvas');
    bhCanvas.width = bhCanvas.height = 50;
    var bhCtx = bhCanvas.getContext('2d');

    opacity = 0;
    for (var i = 0; i < 20; i++) {
      opacity += 0.05;
      bhCtx.beginPath();
      bhCtx.fillStyle = "rgba(188,186,187," + opacity + ")";
      bhCtx.arc(bhCanvas.width / 2, bhCanvas.height / 2, 25 - i, 0, Math.PI * 2);
      bhCtx.fill();
    }
    return bhCanvas;
  })();


  /**
   * 粒子类
   * @param {*} options 
   */
  function Particle(options) {
    this.x = options.x;
    this.y = options.y;
    this.r = options.r;
    this.color = options.color;
    this._init();
  }
  Particle.prototype = {
    constructor: Particle,
    _init: function() {
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * 4 - 2;
      this.ax = 0;
      this.ay = 0;
    },
    move: function() {
      this.vx += this.ax;
      this.vy += this.ay;

      var maxSpeed = 10;
      this.vx = Math.abs(this.vx) > maxSpeed ? maxSpeed * Math.abs(this.vx) / this.vx : this.vx;
      this.vy = Math.abs(this.vy) > maxSpeed ? maxSpeed * Math.abs(this.vy) / this.vy : this.vy;

      this.oldx = this.x;
      this.oldy = this.y;
      this.x += this.vx;
      this.y += this.vy;

      this.vx = (this.x >= 0 && this.x <= canvas.width + this.r * 2) ? this.vx : -this.vx * 0.98;
      this.vy = (this.y >= 0 && this.y <= canvas.height + this.r * 2) ? this.vy : -this.vy * 0.98;
    },
    attract: function() {
      this.ax = this.ay = 0;
      for (var i = 0; i < blackholes.length; i++) {
        var bh = blackholes[i];
        var cx = bh.x - this.x;
        var cy = bh.y - this.y;
        var angle = Math.atan(cx/cy);

        var power = bh.power * 0.1;

        var lax = Math.abs(power * Math.sin(angle));
        var lay = Math.abs(power * Math.cos(angle));

        this.ax += cx > 0 ? lax : -lax;
        this.ay += cy > 0 ? lay : -lay;
      }
    },
    draw: function() {
      var bc = bufContext;
      bc.save();
      bc.strokeStyle = this.color;
      bc.lineCap = bc.lineJoin = "round"; // 线的端点处理
      bc.lineWidth = this.r;
      bc.beginPath();
      bc.moveTo(this.oldx - this.r, this.oldy - this.r);
      bc.lineTo(this.x - this.r, this.y - this.r);
      bc.stroke();
      bc.restore();
    },
  };

  /**
   * 黑洞类
   * @param {*} options 
   */
  function BlackHole(options) {
    this.x = options.x;
    this.y = options.y;
    this.r = options.r;
    this.power = options.power;
    this.step = 2;
    this.bigger = 10;
    this.animate(0);
  }
  BlackHole.prototype = {
    constructor: BlackHole,
    drawLight: function(ctx) {
      if (this.isAdd) {
        if ((this.ir += this.step) > (this.r + this.bigger)) {
          this.isAdd = false;
        }
      } else {
        this.ir = this.ir <= this.r ? this.r : this.ir - this.step;
        if (this.destory && this.ir === this.r) {
          blackholes.splice(blackholes.indexOf(this), 1);
        }
      }

      var imgr = this.ir * 1.4;
      ctx.drawImage(bhImage, this.x - imgr, this.y - imgr, imgr * 2, imgr * 2);
    },
    draw: function(ctx) {
      ctx.beginPath();
      ctx.fillStyle = "#000";
      ctx.arc(this.x, this.y, this.ir, 0, Math.PI * 2);
      ctx.fill();
    },
    animate: function(ir) {
      this.ir = ir;
      this.isAdd = true;
    },
    attract: function(bh) {
      if (bh.r >= this.r) {
        var cx = bh.x - this.x;
        var cy = bh.y - this.y;
        var jl = Math.sqrt(cx * cx + cy * cy);
        var power = (bh.r - this.r) * 10 / jl + 0.5;
        var lax = Math.abs(power * cx / jl);
        var lay = Math.abs(power * cy / jl);
        this.x += cx > 0 ? lax : -lax;
        this.y += cy > 0 ? lay : -lay;
      }
    },
    check: function(bh) {
      if (!bh || !(bh instanceof BlackHole) || this.destory || bh.destory) { return false; }
      var cx = bh.x - this.x;
      var cy = bh.y - this.y;
      var cr = bh.ir + this.ir;

      cx = Math.abs(cx);
      cy = Math.abs(cy);

      if (cx < cr && cy < cr && Math.sqrt(cx * cx + cy * cy) <= Math.abs(bh.r - this.r) + 3) {
        var nbh, lbh;
        if (bh.r > this.r) {
          nbh = bh;
          lbh = this;
        } else {
          nbh = this;
          lbh = bh;
        }

        nbh.r = ~~Math.sqrt(bh.r * bh.r + this.r * this.r);
        nbh.power = bh.power + this.power;
        nbh.animate(Math.max(bh.r, this.r));

        if (nbh.r > BH_DETORY_SIZE) { nbh.destory = true; }
        return lbh;
      }

      return false;
    },
  };

  // 事件绑定
  var target = null;
  canvas.onmousedown = function(e) {
    var x = e.clientX - this.offsetLeft;
    var y = e.clientY - this.offsetTop;
    for (let i = 0; i < blackholes.length; i++) {
      var bh = blackholes[i];
      var cx = bh.x - x;
      var cy = bh.y - y;
      if (cx * cx + cy * cy <= bh.r * bh.r) {
        target = bh;
        break;
      }
    }
    if (!target && e.button === 0) {
      return blackholes.push(new BlackHole({
        x: x,
        y: y,
        r: BH_SIZE,
        power: 2,
      }));
    } else if (e.button === 2){
      bh.destory = true;
      bh.animate(bh.r);
      bh.r += 5;
    }
  }
  canvas.onmousemove = function(e) {
    if (target) {
      var x = e.clientX - this.offsetLeft;
      var y = e.clientY - this.offsetTop;
      target.x = x;
      target.y = y;
    }
  }
  canvas.onmouseup = function(e) {
    target = null;
  }

  // 执行动画
  execAnimate = function() {
    for (var i = 1; i < 500; i++) {
      particles.push(new Particle({
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        r: Math.random() * 2 + 1,
        color: "rgba(255,255,255,0.5)"
      }));
    }
    animate();
  }

  // 动画逐帧逻辑
  animate = function() {
    var bc = bufContext;
    bc.save();
    bc.globalCompositeOperation = 'destination-out';
    bc.globalAlpha = 0.3;
    bc.fillRect(0, 0, canvas.width, canvas.height);
    bc.restore();
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 先画所有黑洞的光
    for (var i = 0; i < blackholes.length; i++) {
      var bh = blackholes[i];
      if (bh) { bh.drawLight(context); }
    }

    // 再画黑洞
    var deleteArray = []; // 存放要删除的黑洞对象
    var deleteBh;
    for (var i = 0; i < blackholes.length; i++) {
      var bh = blackholes[i];
      if (bh) { bh.draw(context); }
      for (var j = 0; j < blackholes.length; j++) {
        var bh2 = blackholes[j];
        if (!bh || !bh2 || bh === bh2) { continue; }

        bh.attract(bh2);  // 黑洞相互吸引

        if (j > i && (deleteBh = bh.check(bh2))) {  // 检查碰撞，若有碰撞则返回被吞噬的黑洞对象
          deleteArray.push(deleteBh);
        }

      }
    }

    // 删除发生碰撞的黑洞
    for (var i = 0; i < deleteArray.length; i++) {
      var deleteBh = deleteArray[i];
      blackholes.splice(blackholes.indexOf(deleteBh), 1);
    }
    
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.attract();
      p.move();
      p.draw();
    }

    context.drawImage(bufCanvas, 0, 0);

    RAF(animate);
  }

  // 执行
  execAnimate();
}