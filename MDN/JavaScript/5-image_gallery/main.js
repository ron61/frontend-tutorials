const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Looping through images */
for(let img_id = 1;img_id<6;img_id++){
    const newImage = document.createElement('img');
    newImage.setAttribute('src', `images/pic${img_id}.jpg`);
    thumbBar.appendChild(newImage);

    newImage.addEventListener(
        'click',
        function(e){
            displayedImage.setAttribute('src',e.target.getAttribute('src'));
        }
    );
}

/* Wiring up the Darken/Lighten button */
btn.addEventListener(
    `click`,
    function(e){
        if(e.target.getAttribute('class')==="dark"){
            btn.setAttribute('class', "light");
            btn.textContent = "Darken";
            overlay.style.backgroundColor = "rgba(0,0,0,0)";
        }else{
            btn.setAttribute('class', "dark");
            btn.textContent = "Lighten";
            overlay.style.backgroundColor = "rgba(100,100,100,0.5)";
        }
    }
);