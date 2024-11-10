import { AfterViewInit, Component } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements AfterViewInit {


  ngAfterViewInit() {
    $(() => {
      this.initCanvasAnimation();
    });
  }

  initCanvasAnimation() {
    const requestAnimationFrame = window.requestAnimationFrame ||
                                  window.requestAnimationFrame ||
                                  window.requestAnimationFrame ||
                                  window.requestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    const canvas = document.getElementById('canvas-404') as HTMLCanvasElement;
    if (canvas === null) return;

    setTimeout(() => {
      $('.js-toaster_lever').delay(200).animate({ top: 30 }, 100);
      $('.js-toaster_toast').removeClass('js-ag-hide').addClass('js-ag-animated js-ag-bounce-in-up');
    }, 800);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let loading = true;
    canvas.height = 210;
    canvas.width = 300;

    const parts: Smoke[] = [];
    const minSpawnTime = 100;
    let lastTime = new Date().getTime();
    const maxLifeTime = Math.min(6000, (canvas.height / (1.5 * 60) * 1000));
    const emitterX = canvas.width / 2 - 50;
    const emitterY = canvas.height - 10;
    const smokeImage = new Image();

    function spawn() {
      if (new Date().getTime() > lastTime + minSpawnTime) {
        lastTime = new Date().getTime();
        parts.push(new Smoke(emitterX, emitterY));
      }
    }

    function render():void {
      if (loading) {
        load();
        return ;
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].y < 0 || parts[i].lifeTime > maxLifeTime) {
          parts.splice(i, 1);
        } else {
          parts[i].update();
if(ctx){
   ctx.save();

  const offsetX = -parts[i].size / 2;
  const offsetY = -parts[i].size / 2;
  ctx.translate(parts[i].x - offsetX, parts[i].y - offsetY);
  ctx.rotate(parts[i].angle / 180 * Math.PI);
  ctx.globalAlpha = parts[i].alpha;
          ctx.drawImage(smokeImage, offsetX, offsetY, parts[i].size, parts[i].size);
          ctx.restore();
}




        }
      }

      spawn();
      requestAnimationFrame(render);
    }

    class Smoke {
      x: number;
      y: number;
      size: number;
      startSize: number;
      endSize: number;
      angle: number;
      startLife: number;
      lifeTime: number;
      velY: number;
      velX: number;
      alpha: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = 1;
        this.startSize = 60;
        this.endSize = 69;
        this.angle = Math.random() * 359;
        this.startLife = new Date().getTime();
        this.lifeTime = 0;
        this.velY = -1 - (Math.random() * 0.5);
        this.velX = Math.floor(Math.random() * (-6) + 3) / 10;
        this.alpha = 1; // Initialisation de alpha

      }

      update() {
        this.lifeTime = new Date().getTime() - this.startLife;
        this.angle += 0.2;
        const lifePerc = ((this.lifeTime / maxLifeTime) * 100);
        this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * .1);
        this.alpha = 1 - (lifePerc * .01);
        this.alpha = Math.max(this.alpha, 0);
        this.x += this.velX;
        this.y += this.velY;
      }
    }

    smokeImage.src = document.getElementsByTagName('img')[0].src;
    smokeImage.onload = () => {
      loading = false;
    };

    function load() {
      if (loading) {
        setTimeout(load, 3000);
      } else {
        render();
      }
    }

    render();
  }

}
