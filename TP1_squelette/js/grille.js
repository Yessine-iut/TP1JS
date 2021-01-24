  /* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
  Candy Crush Saga etc... c'est un match-3 game... */
  class Grille {
    tabCoockies=[];
    nbLignes;
    nbColonnes;
    cookiesCliquees=[];
    type;
    src;



    constructor(l, c) {
      this.nbLignes=l;
      this.nbColonnes=c;
      //this.remplirTableauDeCookies(6);
      this.initTabSans3(6);
    }
    
    /**
     * parcours la liste des divs de la grille et affiche les images des cookies
     * correspondant à chaque case. Au passage, à chaque image on va ajouter des
     * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
     * et implémenter la logique du jeu.
     */
    showCookies() {
      let caseDivs = document.querySelectorAll("#grille div");

      caseDivs.forEach((div, index) => {
        let ligne = Math.floor(index / this.nbColonnes);
        let colonne=index%this.nbColonnes;
        

        console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

        let img = this.tabCoockies[ligne][colonne].htmlImage;
        //Dès qu'on clique sur une image, on selectionne ou on fait le switch
        img.onclick=(evt)=>{ 
          console.log("Image cliquée");
          let imgCliquee=evt.target;
          let l=imgCliquee.dataset.ligne;
          let c=imgCliquee.dataset.colonne;
          let cookie=this.tabCoockies[l][c];
          cookie.selectionnee();
          if(this.cookiesCliquees.length===0){
            this.cookiesCliquees.push(cookie);
        
          }
          else if(this.cookiesCliquees.length===1){
            this.cookiesCliquees.push(cookie);
            if(this.swapPossible()===1){
              this.swapCoockies();
              console.log("swap");
            }
            this.cookiesCliquees[0].deselectionnee();
            this.cookiesCliquees[1].deselectionnee();
            this.cookiesCliquees=[];
            this.detecterMatch3Lignes();
            this.detecterMatch3Colonnes();
            //Méthode mettant en non visible les cookies qui doivent disparaitrent
            this.supprMatch3();
            //Méthode permettant de faire la chute
            this.enleverCoockieMarque();
          }
        }
        img.ondragstart=(evt)=>{
        // evt.preventDefault();
        let imgCliquee=evt.target;
        let l=imgCliquee.dataset.ligne;
        let c=imgCliquee.dataset.colonne;
        let cookie=this.tabCoockies[l][c];
          if(this.cookiesCliquees.length===0){
            this.cookiesCliquees.push(cookie);
        
          }
        console.log("Drag start");
        
        }
        img.ondragover=(evt)=>{
        
          evt.preventDefault();
        }
        img.ondragenter=(evt)=>{
          evt.preventDefault();
//Deux classe css, soit le fond vert pour dire que c'est possible de drag and drop soit rose pour dire impossible
          let cookie=this.tabCoockies[evt.target.dataset.ligne][evt.target.dataset.colonne];
          if(Cookie.distance(this.cookiesCliquees[0],cookie)===1){
            cookie.htmlImage.classList.add("grilleDragOverOk");

          }
          cookie.htmlImage.classList.add("grilleDragOver");
          //cookie.htmlImage.classList.add("grilleDragOverOk");


          
          console.log("Drag enter");
        }
        img.ondragleave=(evt)=>{
          evt.preventDefault();

        let cookie=this.tabCoockies[evt.target.dataset.ligne][evt.target.dataset.colonne];
        cookie.htmlImage.classList.remove("grilleDragOverOk");    

        cookie.htmlImage.classList.remove("grilleDragOver");    


        
        
        }
        img.ondrop=(evt)=>{
          evt.preventDefault();
          let imgCliquee=evt.target;
          let l=imgCliquee.dataset.ligne;
          let c=imgCliquee.dataset.colonne;
          let cookie2=this.tabCoockies[l][c];
          cookie2.htmlImage.classList.remove("grilleDragOver");    
          cookie2.htmlImage.classList.remove("grilleDragOverOk");    



  this.cookiesCliquees.push(cookie2);
          if(this.swapPossible()===1){
            this.swapCoockies();
            console.log("drag and drop");

          }
          this.cookiesCliquees[0].deselectionnee();
          this.cookiesCliquees[1].deselectionnee();
          this.cookiesCliquees=[];


      this.detecterMatch3Lignes();
      this.detecterMatch3Colonnes();
      /**A AJOUTER POUR FAIRE LA CHUTE */
     this.supprMatch3(); // Pas vraiment besoin mais on le fait car dans crandy crush on supprime d'abord puis on fait la chute; ici ce n'est pas visible à l'oeil nu
     
     //On enlève tous les cookies marqué en faisant la chute
     this.enleverCoockieMarque();
     //setTimeout(this.enleverCoockieMarque(), 3000000000);
     

      //this.enleverCoockieMarque();


        
        }
        div.append(img);
      

        // on affiche l'image dans le div pour la faire apparaitre à l'écran.
        //div.appendChild(img);
        //this.detecterMatch3Lignes();

      });        
      this.detecterMatch3Lignes();
      this.detecterMatch3Colonnes();
      let btn = document.querySelector("#aide");

      //ATTENTION On ne pourra jamais rentrer dedans car on supprime direct après le swap faudrait changer notre drag and drop ou bien notre on click au dessus pour pouvoir tester cette méthode
      //Mais elle fonctionne elle permet de supprimer tous les cookies qui sont alignés en appuyant sur le bouton, il désigne le bouton en haut à droite qui se nomme supprimer
      btn.onclick=()=>{
     this.detecterMatch3Lignes();
    this.detecterMatch3Colonnes();
      this.selectionMatch3();
      this.supprMatch3();

      }



    }

//Change deux cookies de place
    swapCoockies(){
      let cookie1=this.cookiesCliquees[0];
      let cookie2=this.cookiesCliquees[1];
      let srcTemp=cookie1.htmlImage.src;
      let typeTemp=cookie1.type;
      cookie1.htmlImage.src=cookie2.htmlImage.src;
      cookie1.type=cookie2.type;
      cookie2.htmlImage.src=srcTemp;
      cookie2.type=typeTemp;

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
      this.tabCoockies = create2DArray(this.nbLignes);
      for(let i=0;i<this.nbColonnes;i++){
        for(let j=0;j<this.nbLignes;j++){
          const type = Math.floor(Math.random()*(nbDeCookiesDifferents));
          console.log("Je rajoute à la position "+i+" "+j+" de type "+type);
          this.tabCoockies[i][j] = new Cookie(type, i, j);
      }
          }

    }
//Permet de savoir si le swap est possible, TODO: Faire en sorte qu'on puisse swap simplement pour casser
    swapPossible(){
      let cookie1=this.cookiesCliquees[0];
      let cookie2=this.cookiesCliquees[1];
  return(Cookie.distance(cookie1,cookie2));
    }

    //Marque les cookies qui sont alignés en ligne
    detecterMatch3Lignes(){

      for(let j=0;j<this.nbLignes;j++){
  for(let i=1;i<this.nbColonnes-1;i++){
  if(this.tabCoockies[j][i].type==this.tabCoockies[j][i+1].type && this.tabCoockies[j][i].type==this.tabCoockies[j][i-1].type){
    this.tabCoockies[j][i].htmlImage.dataset.marque=1;
    this.tabCoockies[j][i+1].htmlImage.dataset.marque=1;
    this.tabCoockies[j][i-1].htmlImage.dataset.marque=1;
  console.log("marque Ligne "+i+" et "+j);

  }
  }
      }


    }
    
//Marque les cookies qui sont alignés en colonne
    detecterMatch3Colonnes(){
      for(let j=0;j<this.nbColonnes;j++){
        for(let i=1;i<this.nbLignes-1;i++){
        if(this.tabCoockies[i][j].type==this.tabCoockies[i+1][j].type && this.tabCoockies[i][j].type==this.tabCoockies[i-1][j].type){
          this.tabCoockies[i][j].htmlImage.dataset.marque=1;
          this.tabCoockies[i+1][j].htmlImage.dataset.marque=1;
          this.tabCoockies[i-1][j].htmlImage.dataset.marque=1;
        console.log("marque colonne "+j+" et "+i);
        
        }
        }
            }

    }
    //Supprimer les cookies marqué
    supprMatch3(){
      for(let j=0;j<this.nbColonnes;j++){
        for(let i=0;i<this.nbLignes;i++){
        if(this.tabCoockies[i][j].htmlImage.dataset.marque==1){
          this.tabCoockies[i][j].htmlImage.style.visibility='hidden';
        }
        
        }
        }

            }


            selectionMatch3(){
              for(let j=0;j<this.nbColonnes;j++){
                for(let i=0;i<this.nbLignes;i++){
                if(this.tabCoockies[i][j].htmlImage.dataset.marque==1){
                  this.tabCoockies[i][j].selectionnee();
                }
                
                }
                }
                    }

  
    /*
    Initialiser le tableau de coockies sans qu'on ait un match de 3
    */
    initTabSans3(nb){
      this.remplirTableauDeCookies(nb);
      this.enleverCoockieMarque();
      /*let isMarque=1;
      while(isMarque==1){
        console.log("init");
        isMarque=0;
        this.detecterMatch3Lignes();
        this.detecterMatch3Colonnes();
      
        for(let i=0;i<this.nbColonnes;i++){
          for(let j=0;j<this.nbLignes;j++){
            if(this.tabCoockies[i][j].htmlImage.dataset.marque==1){
              isMarque=1;
                this.tabCoockies[i][j].type=Math.floor(Math.random()*(nb));
                this.tabCoockies[i][j].htmlImage.src=Cookie.urlsImagesNormales[this.tabCoockies[i][j].type];
                this.tabCoockies[i][j].deselectionnee();
                this.tabCoockies[i][j].htmlImage.dataset.marque=0;
      
              }
            
              }
        }
      }*/
      
          }
//Décale un cookie qui doit disparaitre jusqu'à arrivé tout en haut puis le mettre en visible
          enlever1Coockie(ligne,colonne){
            this.tabCoockies[ligne][colonne].htmlImage.dataset.marque=0;

            this.tabCoockies[ligne][colonne].htmlImage.style.visibility='visible';

            
            for(let i=ligne;i>0;i--){
              this.tabCoockies[i][colonne].type=this.tabCoockies[i-1][colonne].type;
              this.tabCoockies[i][colonne].htmlImage.src=Cookie.urlsImagesNormales[this.tabCoockies[i-1][colonne].type];
              this.tabCoockies[i][colonne].htmlImage.style.visibility=this.tabCoockies[i-1][colonne].htmlImage.visibility;


              
              
              this.tabCoockies[i][colonne].deselectionnee();
              //this.sleep(30); J'ai essayé de faire une animation pour voir les cookies descendre un par un mais ça n'a pas aboutit...
            }
            this.tabCoockies[0][colonne].type=Math.floor(Math.random()*(6));
            this.tabCoockies[0][colonne].htmlImage.src=Cookie.urlsImagesNormales[this.tabCoockies[0][colonne].type];
             this.tabCoockies[0][colonne].htmlImage.style.visibility='visible';
            this.tabCoockies[0][colonne].deselectionnee();


            

          }
//Pas utilisé
          sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
              if ((new Date().getTime() - start) > milliseconds){
                break;
              }
            }
          }

//Fonction qui va permettre de décaler tous les cookies qui ont été marqué c'est à dire qui doivent disparaitre
          enleverCoockieMarque(){
  let isMarque=1;
      while(isMarque==1){
        isMarque=0;
        this.detecterMatch3Lignes();
        this.detecterMatch3Colonnes();
        for(let i=0;i<this.nbColonnes;i++){
          for(let j=0;j<this.nbLignes;j++){
            if(this.tabCoockies[i][j].htmlImage.dataset.marque==1){
              isMarque=1;
              //setTimeout(this.enlever1Coockie(i,j), 300) // J'ai essayé de faire l'animation de la descente ça n'a pas aboutit...
              this.enlever1Coockie(i,j);

              this.tabCoockies[i][j].htmlImage.dataset.marque=0;
              

              //this.sleep(40); Un autre sleep pour essayer d'animer la descente, je l'ai mit un peu partout pour tester j'ai vu les différents résultats

      
              }
            
              }
        }
      }

          }


    }



