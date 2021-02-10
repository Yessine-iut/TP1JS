/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  tabCookies = [];

  constructor(l, c, canvasLargeur, canvasHauteur, assetsLoaded) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.canvasLargeur = canvasLargeur;
    this.canvasHauteur = canvasHauteur;
    this.cookiesCliquees = [];
    this.largeurColonnes = canvasLargeur / c;
    this.hauteurLignes = canvasHauteur / l;
    this.assets = assetsLoaded;

    // on passe en paramètre le nombre de cookies différents. 4 = facile, 5 = moyen,
    // 6 = difficile
    this.remplirTableauDeCookies(6); // valeurs possible : 4, 5, 6 par ex
  }

  drawGrille(ctx) {
    ctx.save();
    // todo : dessiner une grille
    // on est en mode "path"
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "lightgrey";

    // lignes verticales de la grille
    for (
      let x = this.largeurColonnes;
      x < this.canvasLargeur;
      x += this.largeurColonnes
    ) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHauteur);
    }

    // lignes verticales de la grille
    for (
      let y = this.hauteurLignes;
      y < this.canvasHauteur;
      y += this.hauteurLignes
    ) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasLargeur, y);
    }

    ctx.stroke();

    ctx.restore();
  }
  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies(ctx) {
    ctx.save();
    // TODO dessiner les cookies dans la grille
    let y = 0;
    for (let l = 0; l < this.nbLignes; l++) {
      let x = 7;
      for (let c = 0; c < this.nbColonnes; c++) {
        let cookie = this.tabCookies[l][c];

        cookie.draw(ctx, x, y);
        x += this.largeurColonnes;
      }
      y += this.hauteurLignes;
    }
    ctx.restore();
  }

  getCookie(x, y) {
    let c = Math.floor(x / this.largeurColonnes);
    let l = Math.floor(y / this.hauteurLignes);

    return this.tabCookies[l][c];
  }


  detecterMatch3Lignes() {
    for (let l = 0; l < this.nbLignes; l++) {
      for (let c = 0; c < this.nbColonnes; c++) {
        if (c + 2 < this.nbColonnes) {
          if (this.tabCookies[l][c].type == this.tabCookies[l][c + 1].type && this.tabCookies[l][c + 1].type == this.tabCookies[l][c + 2].type) {
            this.tabCookies[l][c].marque = 1;
            this.tabCookies[l][c + 1].marque = 1;
            this.tabCookies[l][c + 2].marque = 1;
            console.log("ligne detecter = " + this.tabCookies[l][c].ligne + " " + this.tabCookies[l][c].colonne + " " + this.tabCookies[l][c + 1].colonne + " " + this.tabCookies[l][c + 2].colonne);
          }
        }
      }
    }
  }

  detecterMatch3Colonnes() {
    for (let c = 0; c < this.nbColonnes; c++) {
      for (let l = 0; l < this.nbLignes; l++) {
        if (l + 2 < this.nbLignes) {
          //if (this.tabCookies[l][c].marque == this.tabCookies[l + 1][c].marque && this.tabCookies[l][c].marque == this.tabCookies[l + 2][c].marque){
          if (this.tabCookies[l][c].type == this.tabCookies[l + 1][c].type && this.tabCookies[l + 1][c].type == this.tabCookies[l + 2][c].type) {
            this.tabCookies[l][c].marque = 1;
            this.tabCookies[l + 1][c].marque = 1;
            this.tabCookies[l + 2][c].marque = 1;
            console.log("colonne detecter = " + this.tabCookies[l][c].colonne + " " + this.tabCookies[l][c].ligne + " " + this.tabCookies[l + 1][c].ligne + " " + this.tabCookies[l + 2][c].ligne);
        
          }
        }
      }
    }
  }
  detecterAlignement() {
    this.detecterMatch3Lignes();
    this.detecterMatch3Colonnes();
  }
  detecterMatchColonnes() {
    for (let c = 0; c < this.nbColonnes; c++) {
      for (let l = 0; l < this.nbLignes; l++) {
        if (l + 2 < this.nbLignes) {
          //if (this.tabCookies[l][c].marque == this.tabCookies[l + 1][c].marque && this.tabCookies[l][c].marque == this.tabCookies[l + 2][c].marque){
          if (this.tabCookies[l][c].type == this.tabCookies[l + 1][c].type && this.tabCookies[l + 1][c].type == this.tabCookies[l + 2][c].type) {
           console.log("colonne detecter = " + this.tabCookies[l][c].colonne + " " + this.tabCookies[l][c].ligne + " " + this.tabCookies[l + 1][c].ligne + " " + this.tabCookies[l + 2][c].ligne);
           return true;
          }
        }
      }
    }
  }
  detecterMatchLignes() {
    for (let l = 0; l < this.nbLignes; l++) {
      for (let c = 0; c < this.nbColonnes; c++) {
        if (c + 2 < this.nbColonnes) {
          if (this.tabCookies[l][c].type == this.tabCookies[l][c + 1].type && this.tabCookies[l][c + 1].type == this.tabCookies[l][c + 2].type) {
          
            console.log("ligne detecter = " + this.tabCookies[l][c].ligne + " " + this.tabCookies[l][c].colonne + " " + this.tabCookies[l][c + 1].colonne + " " + this.tabCookies[l][c + 2].colonne);
            return true;
          }
        }
      }
    }
  }

  chute_de_cookie() {
  
    this.detecterAlignement();
    for (let c = this.nbLignes - 1; c >= 0; c--) {
      for (let l = this.nbColonnes - 1; l > 0; l--) {
        if (this.tabCookies[l][c].marque === 1) {
          let tmpCookieType = this.tabCookies[l][c].type;
          let tmpCookieImage = this.tabCookies[l][c].image;
          let tmpCookieMarque = this.tabCookies[l][c].marque;

          this.tabCookies[l][c].type = this.tabCookies[l - 1][c].type;
          this.tabCookies[l][c].marque = this.tabCookies[l - 1][c].marque;
          this.tabCookies[l][c].image = this.tabCookies[l - 1][c].image;
          this.tabCookies[l][c].currentY = this.tabCookies[l - 1][c].currentY;

          this.tabCookies[l - 1][c].type = tmpCookieType;
          this.tabCookies[l - 1][c].marque = tmpCookieMarque;
          this.tabCookies[l - 1][c].image = tmpCookieImage;

        
        }
      }
    }
  }
 
  nouveau_cookie() {
    for (let l = 0; l < this.nbLignes; l++) {
      for (let c = 0; c < this.nbColonnes; c++) {
        if (this.tabCookies[l][c].marque === 1) {
          let type = Math.floor(Math.random() * 6); // retourne un random entre 0 et 5
          let cookie 
          switch (type) {
            case 0:
              cookie = new Cookie(type, l, c, this.assets.croissant);
              break;
            case 1:
              cookie = new Cookie(type, l, c, this.assets.cupcake);
              break;
            case 2:
              cookie = new Cookie(type, l, c, this.assets.danish);
              break;
            case 3:
              cookie = new Cookie(type, l, c, this.assets.donut);
              break;
            case 4:
              cookie = new Cookie(type, l, c, this.assets.macaroon);
              break;
            case 5:
              cookie = new Cookie(type, l, c, this.assets.sugarCookie);
              break;
          }
          this.tabCookies[l][c].type = cookie.type;
          this.tabCookies[l][c].marque = 0;
          this.tabCookies[l][c].image = cookie.image;
        }
      }
    }
  }
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    this.tabCookies = create2DArray(this.nbLignes);

    // TODO : remplir le tableau avec des cookies au hasard
    for (let l = 0; l < this.nbLignes; l++) {
      for (let c = 0; c < this.nbColonnes; c++) {
        let type = Math.floor(nbDeCookiesDifferents * Math.random()); // valeur aléatoire entre 0 et nbDeCookiesDifferents
        let cookie; // = new Cookie(type, l, c, image)
        switch (type) {
          case 0:
            cookie = new Cookie(type, l, c, this.assets.croissant);
            break;
          case 1:
            cookie = new Cookie(type, l, c, this.assets.cupcake);
            break;
          case 2:
            cookie = new Cookie(type, l, c, this.assets.danish);
            break;
          case 3:
            cookie = new Cookie(type, l, c, this.assets.donut);
            break;
          case 4:
            cookie = new Cookie(type, l, c, this.assets.macaroon);
            break;
          case 5:
            cookie = new Cookie(type, l, c, this.assets.sugarCookie);
            break;
        }
        this.tabCookies[l][c] = cookie;
      }
    }
  }
}
