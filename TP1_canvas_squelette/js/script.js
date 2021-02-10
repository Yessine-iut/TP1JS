// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;
let canvas, ctx, canvasLargeur, canvasHauteur;
let mousePos = {};
let userState = "rien";
let cookieDragguee = null;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  loadAssets(startGame);
}

function startGame(assetsLoaded) {
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext("2d");
  canvasLargeur = canvas.width;
  canvasHauteur = canvas.height;

  grille = new Grille(9, 9, canvasLargeur, canvasHauteur, assetsLoaded);
  
  canvas.onmousedown = traiteMouseDown;
  canvas.onmouseup = traiteMouseUp;
  canvas.onmousemove = traiteMouseMove;

  grille.detecterAlignement();
 
  requestAnimationFrame(animationLoop);
}

function traiteMouseDown(event) {
  console.log("Souris cliquée bouton = " + event.button);
  //console.log("souris clickée " + mousePos.x + " " + mousePos.y);
  
  switch (userState) {
    case "cookieEnDrag":
    case "rien":
      // on a cliqué sur une cookie, on va recherche la cookie en fonction
      // du x et du y cliqué
      // puis on va changer l'état pour "cookieEnDrag"
      userState = "cookieEnDrag";

      cookieDraggee = grille.getCookie(mousePos.x, mousePos.y);
      console.log(cookieDraggee.image);
      
     
  }
}

function traiteMouseUp(event) {
  console.log("Souris relâchée bouton = " + event.button);
  console.log("souris relâchée " + mousePos.x + " " + mousePos.y);
  switch (userState) {
    case "cookieEnDrag":
      cookieCible = grille.getCookie(mousePos.x, mousePos.y);
      // regarder si on peut swapper ? ou si on est pas trop loin....
      console.log("on essaie d echanger avec une cookie de type : " + cookieCible.type);
      if(Cookie.distance(cookieDraggee,cookieCible)===1){
      let cookietype =cookieCible.type;
      let cookieimage =cookieCible.image;
      
      cookieCible.type=cookieDraggee.type;
      cookieCible.image= cookieDraggee.image;

      cookieDraggee.type=cookietype;
      cookieDraggee.image= cookieimage;
      while(grille.detecterMatchLignes()||grille.detecterMatchColonnes()  ){
      grille.detecterAlignement();
      grille.chute_de_cookie();
      grille.nouveau_cookie() ;
    }
      }
      userState = "rien";
      break;
    case "rien":
    
      break;
  }
}

function getMousePos(event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  mousePos = {
    x: x,
    y: y,
  };
}

function traiteMouseMove(event) {
  getMousePos(event);
  //console.log("x souris = " + mousePos.x + " y souris = " + mousePos.y);
}

function animationLoop() {
  // Efface le canvas
  ctx.clearRect(0, 0, canvasLargeur, canvasHauteur);

  // On dessine les objets
  grille.drawGrille(ctx);
  grille.showCookies(ctx);

  //grille.chute_de_cookie();


  switch (userState) {
    case "cookieEnDrag": {
      cookieDraggee.dragAndDraw(ctx, mousePos.x, mousePos.y);
      
      
      break;

    }
  }
  // on demande à redessiner 60 fois par seconde
  requestAnimationFrame(animationLoop);
}
