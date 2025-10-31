
// Redesigned by telegram.dog/TheFirstSpeedster at https://www.npmjs.com/package/@googledrive/index which was written by someone else, credits are given on Source Page.More actions
// v2.3.6
// Initialize the page
function init() {
	document.siteName = $('title').html();
	var html = `<header>
   <div id="nav">
   </div>
</header>
<style>
.donate .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13rem;
    overflow: hidden;
    height: 3rem;
    background-size: 300% 300%;
    cursor: pointer;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
    transition: 0.5s;
    animation: gradient_301 5s ease infinite;
    border: double 4px transparent;
    background-image: linear-gradient(#212121, #212121),
        linear-gradient(
            137.48deg,
            #ffdb3b 10%,
            #fe53bb 45%,
            #8f51ea 67%,
            #0044ff 87%
        );
    background-origin: border-box;
    background-clip: content-box, border-box;
    text-decoration: none;
    position: relative;
}

#container-stars {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.5s;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
}

strong {
    z-index: 2;
    font-family: "Avalors Personal Use", sans-serif;
    font-size: 12px;
    letter-spacing: 5px;
    color: #ffffff;
    text-shadow: 0 0 4px white;
}

#glow {
    position: absolute;
    display: flex;
    width: 12rem;
}

.circle {
    width: 100%;
    height: 30px;
    filter: blur(2rem);
    animation: pulse_3011 4s infinite;
    z-index: -1;
}

.circle:nth-of-type(1) {
    background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
    background: rgba(142, 81, 234, 0.704);
}

.donate .btn:hover #container-stars {
    z-index: 1;
    background-color: #212121;
}

.donate .btn:hover {
    transform: scale(1.1);
}

.donate .btn:active {
    border: double 4px #fe53bb;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: none;
}

.donate .btn:active .circle {
    background: #fe53bb;
}

#stars {
    position: relative;
    background: transparent;
    width: 200rem;
    height: 200rem;
}

#stars::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -100rem;
    width: 100%;
    height: 100%;
    animation: animStarRotate 90s linear infinite;
}

#stars::after {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
}

#stars::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 170%;
    height: 500%;
    animation: animStar 60s linear infinite;
}

#stars::before {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
    opacity: 0.5;
}

@keyframes animStar {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-135rem);
    }
}

@keyframes animStarRotate {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}

@keyframes gradient_301 {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@keyframes pulse_3011 {
    0% {
        transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }
    100% {
        transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}

.donate:hover .qrcode {
    display: block;
}

.qrcode {
    display: none;
    margin-top: 1rem;
}
</style>
<div class="loading" id="spinner" style="display:none;">Loading&#8230;</div>
<div class="container" style="margin-top: ${UI.header_padding}px; margin-bottom: 60px;">
	<div class="row align-items-start g-3">
		`+TamizhanWidget;
		html += ` 
    <div id="content" style="${UI.fixed_footer ? 'padding-bottom: clamp(170px, 100%, 300px);' : ''}"></div>
  </div>
  <div class="row g-3 mt-0">
     <div class="col-lg-6 col-md-12">
        <div class="card text-white mb-3 h-100">
	      <div class="card-header">
        <i class="fa-solid fa-circle-question"></i> How&nbsp; To&nbsp; Download&nbsp; Movies&nbsp; 🤔 
        </div>
        <div class="card-body d-flex align-items-center justify-content-center">
        <div class="donate btn p-0">
	       <a class="btn" href="https://t.me/tamizhan_updates/266" title="Watch Video Clearly" target="_blank">
         <strong>
             <i class="fa-solid fa-eye"></i>WATCH VIDEO
         </strong>
         <div id="container-stars">
             <div id="stars"></div>
         </div>
         <div id="glow">
             <div class="circle"></div>
             <div class="circle"></div>
         </div>
       </a>
       <div class="qrcode card" style="padding: 1rem 1rem 0 1rem;">
         <div style="padding-bottom: 1rem;">3 Step-by-step guide 🎬</div> 
	     </div>
		</div>
      </div>
    </div>
  </div>
  <div class="col-lg-6 col-md-12">
    <div class="card text-white mb-3 h-100">
      <div class="card-header">
        ${telegram_icon}&nbsp;&nbsp;Join &nbsp;Our &nbsp;Telegram &nbsp;Channels
      </div>
      <div class="card-body d-flex flex-wrap gap-2 justify-content-evenly align-items-center">
		<a href="https://cutt.ly/zrMe2JpH" target="_blank" title="𝕋ꪖꪑⅈ𝕫ꫝꪖꪀ 𝕄ꪮꪜⅈꫀડ">
			<img class="image" alt="tamizhan" style="height: 45px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tm-icon.png">
		</a>
		<a href="https://cutt.ly/ZrBTy6LJ" target="_blank" title="Hollywood Tamizhan Movies">
			<img class="image" alt="Movies" style="height: 45px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/htm-icon.png">
		</a>
		<a href="https://cutt.ly/irMe1nkm" target="_blank" title="Tamizhan Web Series">
			<img class="image" alt="Series" style="height: 45px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tws-icon.png">
		</a>
		<a href="https://cutt.ly/ZrMe1emr" target="_blank" title="Tamizhan Movies Backup">
			<img class="image" alt="telegram" style="height: 50px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/telegram.png">
		</a>
      </div> 
    </div>
  </div>
</div>	
</div>
<div class="modal fade" id="SearchModel" data-bs-keyboard="true" tabindex="-1" aria-labelledby="SearchModelLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="SearchModelLabel"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="modal-body" id="modal-body-space">
      </div>
      <div class="modal-footer justify-content-center" id="modal-body-space-buttons">
      </div>
    </div>
  </div>
</div>
<button id="back-to-top" class="btn btn-secondary btn-lg back-to-top shadow border border-light" style="--bs-border-opacity: .4;" role="button"><i class="fas fa-chevron-up m-0"></i></button>
<footer class="footer text-center mt-auto container ${UI.footer_style_class}" style="${UI.fixed_footer ? 'position: fixed;' : ''} ${UI.hide_footer ? 'display:none;' : 'display:block;'}">
    <div class="container" style="padding-top: 15px;">
      <div class="row">
      <div class="col-lg-4 col-md-12 text-lg-start">
      <i class="fa-brands fa-pied-piper-alt"></i> ${new Date().getFullYear()} - <a href="${UI.company_link}" target="_blank">${UI.company_name}</a> with ❤️
	    </div>
      <div class="col-lg-4 col-md-12">
      <a href="https://cutt.ly/cr9jPsvc" title="Please allow us up to 48 hours to process DMCA requests.">DMCA</a> 
      ${UI.credit ? '<span>© All Copy Rights Reserved ®™</span>' : ''}
      </div>
       <div class="col-lg-4 col-md-12 text-lg-end">
        <p>
        <a href="#"><img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2F` + window.location.host + `&label=hits&icon=bar-chart-fill&color=%23198754"/></a>
        </p>
      </div>
	  <script>
		let btt = document.getElementById("back-to-top");
		window.onscroll = function () {
			scrollFunction();
		};
		function scrollFunction() {
			if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
				btt.style.display = "block";
			} else {
				btt.style.display = "none";
			}
		}
		btt.addEventListener("click", backToTop);
		function backToTop() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		}
	  </script>
      </div>
	</div>
</footer>`;
$('body').html(html);
}
const gdrive_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 20 20">
                    <image xlink:href="data:image/png;base64,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" x="0" y="0" width="20" height="20"/>
                  </svg>`
const telegram_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 1395 1158"><path fill="#FFF" d="M1213 122.7c-15 1.7-25.3 5.3-269.5 94.1-418.6 152.4-694.6 257.1-763.1 289.7-29.1 13.8-39.6 27.8-33.8 44.9 2 5.8 9.6 14.3 16.1 17.8 2.6 1.5 61.1 21 129.8 43.4 96.5 31.5 126.1 40.8 129.6 40.7 4.3-.1 9-2.9 64-37.5 285.7-180.2 494.3-309.4 534.6-331 7.3-3.9 10-4.9 13-4.6 3.3.3 3.8.7 4.1 3.1.2 1.6-.6 4.3-1.9 6.4-22 35.6-173 179.9-425 406.1-21.6 19.3-34 31.1-34.6 32.9-1.1 3.3-.5 6.5 1.8 9.1.9 1 20 14.3 42.5 29.4 22.5 15.2 55.1 37.3 72.4 49.1 17.3 11.9 40.7 27.8 52 35.4 80.8 54.5 183.6 129.2 220.9 160.6 20.8 17.4 40.3 24.3 58.3 20.6 12.4-2.6 24-10.9 31.7-22.8 8-12.4 6.1-5.4 47.7-176.6 66.1-271.6 110.2-463.4 131.3-570.5 10-50.8 12.8-70 13.8-93.5.7-18.5-.5-27.1-5-34.7-2.7-4.4-4.3-5.8-9.7-8.5-6.5-3.2-13.7-4.4-21-3.6"/><path fill="#BFBFBF" d="M1017.5 286.6c-49.6 27.5-264.6 160.9-559.5 347-19.3 12.1-32 19.5-34.4 19.9-2.8.6-3.7 1.2-3.3 2.4 1.7 6.4 115.4 319.7 117.4 323.6 3 5.8 8.8 14.5 13.2 19.5l3 3.5-1.5-4.9c-.8-2.7-1.4-8.3-1.4-12.5 0-6.9 21.4-242.5 22.6-247.9l.5-2.4 2 2.6c1.1 1.4 17.8 13.2 37.2 26.3 40.3 27.1 67.3 45.4 107.5 73.1 15.6 10.7 28.5 19.2 28.7 19 .6-.6-60.5-42.5-134.3-92.2-19.4-13.1-36.1-24.7-37.1-25.8-2.5-2.6-3.1-6-1.6-9.5.8-1.8 14.9-15.2 34.6-32.9 239.2-214.4 393.7-361.5 422.1-401.9 3.7-5.3 4.8-7.7 4.6-10-.3-2.7-.7-3-4.3-3.3-3.3-.2-6 .8-16 6.4"/><path fill="#80BFBF" d="M573.6 737.2c-1.2 5.4-22.6 241-22.6 247.9 0 13.3 2.6 18.6 11.2 22.5 4.7 2.1 8.8 1.4 17.2-3 10.7-5.6 21.1-14.2 42.1-34.6 29.5-28.7 40-38.8 60-56.9 20.4-18.6 51.7-46.1 60.4-53.1l5.9-4.7-18.2-12.5c-32.3-22.2-80.3-54.9-116.3-79.1-19.4-13.1-36.1-24.9-37.2-26.3l-2-2.6z"/></svg>`
const folder_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_11)"><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,24,24)"><path fill="rgb(255,159,0)" fill-opacity="1" d=" M16,-12 C16,-12 -2,-12 -2,-12 C-2,-12 -6,-16 -6,-16 C-6,-16 -16,-16 -16,-16 C-18.200000762939453,-16 -20,-14.199999809265137 -20,-12 C-20,-12 -20,12 -20,12 C-20,14.208999633789062 -18.208999633789062,16 -16,16 C-16,16 13.682000160217285,16 13.682000160217285,16 C13.682000160217285,16 20,5 20,5 C20,5 20,-8 20,-8 C20,-10.199999809265137 18.200000762939453,-12 16,-12z"></path></g></g><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,24,26)"><path fill="rgb(255,201,40)" fill-opacity="1" d=" M16,-14 C16,-14 -16,-14 -16,-14 C-18.200000762939453,-14 -20,-12.199999809265137 -20,-10 C-20,-10 -20,10 -20,10 C-20,12.199999809265137 -18.200000762939453,14 -16,14 C-16,14 16,14 16,14 C18.200000762939453,14 20,12.199999809265137 20,10 C20,10 20,-10 20,-10 C20,-12.199999809265137 18.200000762939453,-14 16,-14z"></path></g></g></g></svg>`
const video_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_11)"><g transform="matrix(1,0,0,1,24,24)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(63,81,181)" fill-opacity="1" d=" M16,17 C16,17 -16,17 -16,17 C-18.200000762939453,17 -20,15.199999809265137 -20,13 C-20,13 -20,-9 -20,-9 C-20,-9 20,-9 20,-9 C20,-9 20,13 20,13 C20,15.199999809265137 18.200000762939453,17 16,17z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M16,-9 C16,-9 12,-3 12,-3 C12,-3 16,-3 16,-3 C16,-3 20,-9 20,-9 C20,-9 16,-9 16,-9z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M8,-9 C8,-9 4,-3 4,-3 C4,-3 8,-3 8,-3 C8,-3 12,-9 12,-9 C12,-9 8,-9 8,-9z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M0,-9 C0,-9 -4,-3 -4,-3 C-4,-3 0,-3 0,-3 C0,-3 4,-9 4,-9 C4,-9 0,-9 0,-9z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M-8,-9 C-8,-9 -12,-3 -12,-3 C-12,-3 -8,-3 -8,-3 C-8,-3 -4,-9 -4,-9 C-4,-9 -8,-9 -8,-9z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M-16,-9 C-16,-9 -20,-3 -20,-3 C-20,-3 -16,-3 -16,-3 C-16,-3 -12,-9 -12,-9 C-12,-9 -16,-9 -16,-9z"></path></g></g></g><g transform="matrix(1,0,0,1,24,24)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(63,81,181)" fill-opacity="1" d=" M19.399999618530273,-15.699999809265137 C19.399999618530273,-15.699999809265137 -20,-9 -20,-9 C-20,-9 -20.299999237060547,-11 -20.299999237060547,-11 C-20.700000762939453,-13.199999809265137 -19.200000762939453,-15.199999809265137 -17,-15.600000381469727 C-17,-15.600000381469727 14.600000381469727,-20.899999618530273 14.600000381469727,-20.899999618530273 C16.799999237060547,-21.299999237060547 18.799999237060547,-19.799999237060547 19.200000762939453,-17.600000381469727 C19.200000762939453,-17.600000381469727 19.399999618530273,-15.699999809265137 19.399999618530273,-15.699999809265137z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M-5.199999809265137,-17.600000381469727 C-5.199999809265137,-17.600000381469727 -0.30000001192092896,-12.300000190734863 -0.30000001192092896,-12.300000190734863 C-0.30000001192092896,-12.300000190734863 3.700000047683716,-13 3.700000047683716,-13 C3.700000047683716,-13 -1.2999999523162842,-18.299999237060547 -1.2999999523162842,-18.299999237060547 C-1.2999999523162842,-18.299999237060547 -5.199999809265137,-17.600000381469727 -5.199999809265137,-17.600000381469727z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M-13.100000381469727,-16.299999237060547 C-13.100000381469727,-16.299999237060547 -8.199999809265137,-11 -8.199999809265137,-11 C-8.199999809265137,-11 -4.199999809265137,-11.699999809265137 -4.199999809265137,-11.699999809265137 C-4.199999809265137,-11.699999809265137 -9.199999809265137,-16.899999618530273 -9.199999809265137,-16.899999618530273 C-9.199999809265137,-16.899999618530273 -13.100000381469727,-16.299999237060547 -13.100000381469727,-16.299999237060547z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M2.700000047683716,-18.899999618530273 C2.700000047683716,-18.899999618530273 7.599999904632568,-13.699999809265137 7.599999904632568,-13.699999809265137 C7.599999904632568,-13.699999809265137 11.5,-14.300000190734863 11.5,-14.300000190734863 C11.5,-14.300000190734863 6.599999904632568,-19.600000381469727 6.599999904632568,-19.600000381469727 C6.599999904632568,-19.600000381469727 2.700000047683716,-18.899999618530273 2.700000047683716,-18.899999618530273z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M10.5,-20.200000762939453 C10.5,-20.200000762939453 15.5,-15 15.5,-15 C15.5,-15 19.399999618530273,-15.699999809265137 19.399999618530273,-15.699999809265137 C19.399999618530273,-15.699999809265137 14.5,-20.899999618530273 14.5,-20.899999618530273 C14.5,-20.899999618530273 10.5,-20.200000762939453 10.5,-20.200000762939453z"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(159,168,218)" fill-opacity="1" d=" M-16.5,-14 C-17.327999114990234,-14 -18,-13.32800006866455 -18,-12.5 C-18,-11.67199993133545 -17.327999114990234,-11 -16.5,-11 C-15.67199993133545,-11 -15,-11.67199993133545 -15,-12.5 C-15,-13.32800006866455 -15.67199993133545,-14 -16.5,-14z"></path></g></g></g></svg>`
const code_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_2)"><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,24,21)"><path fill="rgb(83,109,121)" fill-opacity="1" d=" M-18,-13 C-18,-13 18,-13 18,-13 C18,-13 18,13 18,13 C18,13 -18,13 -18,13 C-18,13 -18,-13 -18,-13z"></path></g><g opacity="1" transform="matrix(1,0,0,1,24,20.5)"><path fill="rgb(186,222,250)" fill-opacity="1" d=" M-16,-10.5 C-16,-10.5 16,-10.5 16,-10.5 C16,-10.5 16,10.5 16,10.5 C16,10.5 -16,10.5 -16,10.5 C-16,10.5 -16,-10.5 -16,-10.5z"></path></g><g opacity="1" transform="matrix(1,0,0,1,24,37)"><path fill="rgb(69,90,99)" fill-opacity="1" d=" M-3,-3 C-3,-3 3,-3 3,-3 C3,-3 3,0 3,0 C3,0 -3,0 -3,0 C-3,0 -3,-3 -3,-3z M9,0 C9,0 -9,0 -9,0 C-11,0 -11,2 -11,2 C-11,2 -11,3 -11,3 C-11,3 11,3 11,3 C11,3 11,2 11,2 C11,2 11,0 9,0z"></path></g></g><g transform="matrix(0.8999999761581421,0,0,0.8999999761581421,2.2750015258789062,-1.0999984741210938)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,15.315999984741211,24.465999603271484)"><path fill="rgb(21,101,192)" fill-opacity="1" d=" M-0.8989999890327454,0.02500000037252903 C-0.8989999890327454,0.02500000037252903 3.684000015258789,2.0399999618530273 3.684000015258789,2.0399999618530273 C3.684000015258789,2.0399999618530273 3.684000015258789,4.894999980926514 3.684000015258789,4.894999980926514 C3.684000015258789,4.894999980926514 -3.684000015258789,1.2100000381469727 -3.684000015258789,1.2100000381469727 C-3.684000015258789,1.2100000381469727 -3.684000015258789,-1.1990000009536743 -3.684000015258789,-1.1990000009536743 C-3.684000015258789,-1.1990000009536743 3.684000015258789,-4.894999980926514 3.684000015258789,-4.894999980926514 C3.684000015258789,-4.894999980926514 3.684000015258789,-2.0399999618530273 3.684000015258789,-2.0399999618530273 C3.684000015258789,-2.0399999618530273 -0.8989999890327454,0.02500000037252903 -0.8989999890327454,0.02500000037252903z"></path></g><g opacity="1" transform="matrix(-1,0,0,-1,32.70000076293945,24.465999603271484)"><path fill="rgb(21,101,192)" fill-opacity="1" d=" M-0.8989999890327454,0.02500000037252903 C-0.8989999890327454,0.02500000037252903 3.684000015258789,2.0399999618530273 3.684000015258789,2.0399999618530273 C3.684000015258789,2.0399999618530273 3.684000015258789,4.894999980926514 3.684000015258789,4.894999980926514 C3.684000015258789,4.894999980926514 -3.684000015258789,1.2100000381469727 -3.684000015258789,1.2100000381469727 C-3.684000015258789,1.2100000381469727 -3.684000015258789,-1.1990000009536743 -3.684000015258789,-1.1990000009536743 C-3.684000015258789,-1.1990000009536743 3.684000015258789,-4.894999980926514 3.684000015258789,-4.894999980926514 C3.684000015258789,-4.894999980926514 3.684000015258789,-2.0399999618530273 3.684000015258789,-2.0399999618530273 C3.684000015258789,-2.0399999618530273 -0.8989999890327454,0.02500000037252903 -0.8989999890327454,0.02500000037252903z"></path></g><g opacity="1" transform="matrix(1,0,0,1,24.240999221801758,24)"><path fill="rgb(21,101,192)" fill-opacity="1" d=" M-1.1649999618530273,7.986000061035156 C-1.1649999618530273,7.986000061035156 -3.259000062942505,7.986000061035156 -3.259000062942505,7.986000061035156 C-3.259000062942505,7.986000061035156 1.1619999408721924,-7.916999816894531 1.1619999408721924,-7.916999816894531 C1.1619999408721924,-7.916999816894531 3.259000062942505,-7.916999816894531 3.259000062942505,-7.916999816894531 C3.259000062942505,-7.916999816894531 -1.1649999618530273,7.986000061035156 -1.1649999618530273,7.986000061035156z"></path></g></g></g></svg>`
const zip_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><g transform="translate(0 -1020.362)"><path fill="#e9eded" fill-rule="evenodd" stroke="#4bbfeb" stroke-linecap="round" stroke-linejoin="round" d="m 26.49822,1027.8658 0,21.5 c 0,0.831 -0.66899,1.5 -1.49998,1.5 l -18.00004,0 c -0.83099,0 -1.49998,-0.669 -1.49998,-1.5 l 0,-26 c 0,-0.831 0.66899,-1.5 1.49998,-1.5 l 13.50002,0 z"/><path fill="#4bbfeb" d="m 4.99822,1044.3658 0,2 0,2 0,1 c 0,1.108 0.89198,2 2,2 l 18,0 c 1.10802,0 2,-0.892 2,-2 l 0,-1 0,-2 0,-2 -2,0 -18,0 -2,0 z"/><path fill="#4bbfeb" stroke="#4bbfeb" stroke-linecap="round" stroke-linejoin="round" d="m 26.49466,1027.8658 -4.49997,0 c -0.83099,0 -1.49998,-0.6691 -1.49998,-1.5 l 0,-4.5"/><path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" fill="#4bbfeb" fill-rule="evenodd" d="M 15.498047 7 L 15.498047 8 L 14.498047 8 L 14.498047 9 L 15.498047 9 L 15.498047 10 L 14.498047 10 L 14.498047 11 L 15.498047 11 L 15.498047 12 L 14.498047 12 L 14.498047 13 L 15.498047 13 L 15.498047 14 L 14.498047 14 L 14.498047 15 L 15.498047 15 L 15.498047 16 L 14.498047 16 L 14.498047 17 L 15.498047 17 L 15.498047 18 L 14.998047 18 A 0.50004997 0.50004997 0 0 0 14.498047 18.5 L 14.498047 19.464844 A 0.50004997 0.50004997 0 0 0 14.498047 19.5 L 14.498047 20 L 14.498047 20.5 C 14.498047 21.3224 15.175696 22 15.998047 22 C 16.820398 22 17.498047 21.3224 17.498047 20.5 L 17.498047 20.033203 A 0.50004997 0.50004997 0 0 0 17.498047 20 L 17.498047 19.5 L 17.498047 18.5 A 0.50004997 0.50004997 0 0 0 16.998047 18 L 16.498047 18 L 16.498047 17 L 17.498047 17 L 17.498047 16 L 16.498047 16 L 16.498047 15 L 17.498047 15 L 17.498047 14 L 16.498047 14 L 16.498047 13 L 17.498047 13 L 17.498047 12 L 16.498047 12 L 16.498047 11 L 17.498047 11 L 17.498047 10 L 16.498047 10 L 16.498047 9 L 17.498047 9 L 17.498047 8 L 16.498047 8 L 16.498047 7 L 15.498047 7 z M 15.498047 19 L 16.498047 19 L 16.498047 19.5 L 16.498047 20.5 C 16.498047 20.7857 16.283696 21 15.998047 21 C 15.712398 21 15.498047 20.7857 15.498047 20.5 L 15.498047 20.033203 A 0.50004997 0.50004997 0 0 0 15.498047 20 L 15.498047 19.5 L 15.498047 19 z " color="#000" font-family="sans-serif" font-weight="400" overflow="visible" transform="translate(0 1020.362)"/><path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" fill="#e9eded" fill-rule="evenodd" d="M 13.490234 24.990234 A 0.50005 0.50005 0 0 0 12.998047 25.496094 L 12.998047 29.498047 A 0.50005 0.50005 0 1 0 13.998047 29.498047 L 13.998047 25.496094 A 0.50005 0.50005 0 0 0 13.490234 24.990234 z M 11.511719 24.998047 A 0.50005 0.50005 0 0 0 11.460938 25 L 8.5058594 25 A 0.50005 0.50005 0 1 0 8.5058594 26 L 10.498047 26 L 8.1347656 29.154297 A 0.50005 0.50005 0 0 0 8.4375 29.992188 A 0.50019268 0.50019268 0 0 0 8.4472656 29.994141 A 0.50005 0.50005 0 0 0 8.5058594 29.998047 L 11.494141 29.998047 A 0.50005 0.50005 0 1 0 11.494141 28.998047 L 9.5019531 28.998047 L 11.865234 25.841797 A 0.50005 0.50005 0 0 0 11.75 25.066406 A 0.50005 0.50005 0 0 0 11.720703 25.050781 A 0.50005 0.50005 0 0 0 11.705078 25.042969 A 0.50005 0.50005 0 0 0 11.675781 25.03125 A 0.50005 0.50005 0 0 0 11.658203 25.025391 A 0.50005 0.50005 0 0 0 11.511719 24.998047 z M 16.498047 25.003906 C 15.723646 25.003906 15.086569 25.606569 15.013672 26.363281 C 15.013355 26.366575 15.012014 26.369747 15.011719 26.373047 A 0.50005 0.50005 0 0 0 14.998047 26.498047 C 14.998039 26.500027 14.998047 26.501925 14.998047 26.503906 L 14.998047 29.498047 A 0.50005 0.50005 0 1 0 15.998047 29.498047 L 15.998047 27.910156 C 16.155295 27.966775 16.322382 28.003906 16.498047 28.003906 C 17.320552 28.003906 17.998047 27.326406 17.998047 26.503906 C 17.998047 25.681406 17.320552 25.003906 16.498047 25.003906 z M 16.498047 26.003906 C 16.780112 26.003906 16.998047 26.221906 16.998047 26.503906 C 16.998047 26.786006 16.780112 27.003906 16.498047 27.003906 C 16.215982 27.003906 15.998047 26.786006 15.998047 26.503906 L 15.998047 26.498047 C 16.001131 26.218978 16.217997 26.003906 16.498047 26.003906 z " color="#000" font-family="sans-serif" font-weight="400" overflow="visible" transform="translate(0 1020.362)"/></g></svg>`
const image_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_19)"><g transform="matrix(1,0,0,1,24,24)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(245,124,0)" fill-opacity="1" d=" M16,17 C16,17 -16,17 -16,17 C-18.200000762939453,17 -20,15.199999809265137 -20,13 C-20,13 -20,-13 -20,-13 C-20,-15.199999809265137 -18.200000762939453,-17 -16,-17 C-16,-17 16,-17 16,-17 C18.200000762939453,-17 20,-15.199999809265137 20,-13 C20,-13 20,13 20,13 C20,15.199999809265137 18.200000762939453,17 16,17z"></path></g></g><g transform="matrix(1,0,0,1,35,16)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,249,196)" fill-opacity="1" d=" M0,-3 C-1.656999945640564,-3 -3,-1.656999945640564 -3,0 C-3,1.656999945640564 -1.656999945640564,3 0,3 C1.656999945640564,3 3,1.656999945640564 3,0 C3,-1.656999945640564 1.656999945640564,-3 0,-3z"></path></g></g><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,20,24)"><path fill="rgb(148,42,9)" fill-opacity="1" d=" M0,-8 C0,-8 -11,8 -11,8 C-11,8 11,8 11,8 C11,8 0,-8 0,-8z"></path></g><g opacity="1" transform="matrix(1,0,0,1,31,27)"><path fill="rgb(191,54,12)" fill-opacity="1" d=" M0,-5 C0,-5 -8,5 -8,5 C-8,5 8,5 8,5 C8,5 0,-5 0,-5z"></path></g></g></g></svg>`
const audio_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_30)"><g mask="url(#__lottie_element_41)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,26,24)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(129,211,249)" stroke-opacity="1" stroke-width="2" d=" M-16,0 C-16,-8.836000442504883 -8.836000442504883,-16 0,-16 C0.6779999732971191,-16 1.3450000286102295,-15.958000183105469 2,-15.87600040435791 C9.892999649047852,-14.892000198364258 16,-8.159000396728516 16,0 C16,8.159000396728516 9.892999649047852,14.892000198364258 2,15.87600040435791 C1.3450000286102295,15.958000183105469 0.6779999732971191,16 0,16 C-8.836000442504883,16 -16,8.836999893188477 -16,0z"></path></g></g><g mask="url(#__lottie_element_38)" style="display: none;" transform="matrix(1,0,0,1,0,0)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,26,24)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(129,211,249)" stroke-opacity="1" stroke-width="2" d=" M-16,0 C-16,-8.836000442504883 -8.836000442504883,-16 0,-16 C0.6779999732971191,-16 1.3450000286102295,-15.958000183105469 2,-15.87600040435791 C9.892999649047852,-14.892000198364258 16,-8.159000396728516 16,0 C16,8.159000396728516 9.892999649047852,14.892000198364258 2,15.87600040435791 C1.3450000286102295,15.958000183105469 0.6779999732971191,16 0,16 C-8.836000442504883,16 -16,8.836999893188477 -16,0z"></path></g></g><g mask="url(#__lottie_element_35)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,26,24)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(79,195,247)" stroke-opacity="1" stroke-width="2" d=" M-11,0 C-11,-6.074999809265137 -6.074999809265137,-11 0,-11 C0.6830000281333923,-11 1.3519999980926514,-10.937999725341797 2,-10.819000244140625 C7.119999885559082,-9.878000259399414 11,-5.392000198364258 11,0 C11,5.39300012588501 7.119999885559082,9.878000259399414 2,10.817999839782715 C1.3519999980926514,10.937999725341797 0.6830000281333923,11 0,11 C-6.074999809265137,11 -11,6.074999809265137 -11,0z"></path></g><g opacity="1" transform="matrix(1,0,0,1,26,24)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(3,169,244)" stroke-opacity="1" stroke-width="2" d=" M-6,0 C-6,-3.312999963760376 -3.312999963760376,-6 0,-6 C0.7009999752044678,-6 1.375,-5.880000114440918 2,-5.658999919891357 C4.329999923706055,-4.835000038146973 6,-2.611999988555908 6,0 C6,2.611999988555908 4.329999923706055,4.835000038146973 2,5.6579999923706055 C1.375,5.880000114440918 0.7009999752044678,6 0,6 C-3.312999963760376,6 -6,3.312999963760376 -6,0z"></path></g></g><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,9.5,24)"><path fill="rgb(83,109,121)" fill-opacity="1" d=" M4.5,8 C4.5,8 -2.5,8 -2.5,8 C-3.6050000190734863,8 -4.5,7.105000019073486 -4.5,6 C-4.5,6 -4.5,-6 -4.5,-6 C-4.5,-7.105000019073486 -3.6050000190734863,-8 -2.5,-8 C-2.5,-8 4.5,-8 4.5,-8 C4.5,-8 4.5,8 4.5,8z"></path></g><g opacity="1" transform="matrix(1,0,0,1,20,24)"><path fill="rgb(120,144,156)" fill-opacity="1" d=" M6,18 C6,18 -6,8 -6,8 C-6,8 -6,-8 -6,-8 C-6,-8 6,-18 6,-18 C6,-18 6,18 6,18z"></path></g></g></g></svg>`
const markdown_icon = `<svg width="1.5em" height="1.5em" viewBox="0 0 1024 1024"><path d="M265.61429932 63.6656706h493.57455644c111.51629209 0 201.91670068 90.40220771 201.91670068 201.91580157v493.57545556c0 111.51449297-90.40040859 201.91670068-201.91670068 201.91670069H265.61429932c-111.51539297 0-201.91580068-90.40220771-201.91580069-201.91670069V265.58147217c0-111.51359385 90.40040859-201.91580068 201.91580069-201.91580157z" fill="#707070"></path><path d="M763.60576133 722.16141084L670.49099316 599.42972305h48.19382491V302.57788818h89.84188652v296.85183487h48.19382491L763.60576133 722.16141084zM519.02738545 472.82885791c0-13.71570117 0.30399346-28.21926709 0.91827773-43.48821445l-13.67612753 19.09855107c-0.1726831 0.54323174-0.34626533 1.10265205-0.52074757 1.62609698l-7.15195107 10.50577734-109.52234384 166.63092451-40.52562364-62.91054668h-0.25092949l-28.34248359-44.38850449-41.19926749-63.95563828h0.36425304l-8.60086846-13.47016729-0.46318536-1.8752291-14.42082305-21.30475518c1.05318633 33.22347451 1.60451191 57.42426622 1.60451192 72.50254365v229.53787296h-89.15835059V303.99532753h140.37862325l77.89348828 115.26944679h1.3346956l80.12037832-115.26944678H610.08255019v417.34224141H519.02828457V472.82885791z" fill="#ffffff"></path></svg>`
const pdf_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_44)"><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,24,24)"><path fill="rgb(255,87,34)" fill-opacity="1" d=" M16,21 C16,21 -16,21 -16,21 C-16,21 -16,-21 -16,-21 C-16,-21 6,-21 6,-21 C6,-21 16,-11 16,-11 C16,-11 16,21 16,21z"></path></g><g opacity="1" transform="matrix(1,0,0,1,33.75,9.25)"><path fill="rgb(251,233,231)" fill-opacity="1" d=" M4.75,4.75 C4.75,4.75 -4.75,4.75 -4.75,4.75 C-4.75,4.75 -4.75,-4.75 -4.75,-4.75 C-4.75,-4.75 4.75,4.75 4.75,4.75z"></path></g></g><g transform="matrix(1,0,0,1,24,24)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M-8,15 C-8.399999618530273,15 -8.699999809265137,14.899999618530273 -9,14.800000190734863 C-10.100000381469727,14.199999809265137 -10.199999809265137,13.300000190734863 -10,12.600000381469727 C-9.600000381469727,11.399999618530273 -7.400000095367432,9.899999618530273 -4.5,8.600000381469727 C-4.5,8.600000381469727 -4.5,8.600000381469727 -4.5,8.600000381469727 C-3.200000047683716,6.199999809265137 -2.200000047683716,3.700000047683716 -1.600000023841858,1.600000023841858 C-2.5999999046325684,-0.30000001192092896 -3.0999999046325684,-2.0999999046325684 -3.0999999046325684,-3.4000000953674316 C-3.0999999046325684,-4.099999904632568 -2.9000000953674316,-4.699999809265137 -2.5999999046325684,-5.199999809265137 C-2.200000047683716,-5.699999809265137 -1.600000023841858,-6 -0.800000011920929,-6 C0.10000000149011612,-6 0.800000011920929,-5.5 1.100000023841858,-4.599999904632568 C1.600000023841858,-3.4000000953674316 1.2999999523162842,-1.2000000476837158 0.6000000238418579,1.2999999523162842 C1.600000023841858,3 2.799999952316284,4.599999904632568 4.099999904632568,5.800000190734863 C6,5.400000095367432 7.699999809265137,5.199999809265137 8.800000190734863,5.400000095367432 C10.699999809265137,5.699999809265137 11,7 11,7.5 C11,9.600000381469727 8.800000190734863,9.600000381469727 8,9.600000381469727 C6.5,9.600000381469727 5,9 3.700000047683716,7.900000095367432 C3.700000047683716,7.900000095367432 3.700000047683716,7.900000095367432 3.700000047683716,7.900000095367432 C1.2999999523162842,8.5 -1.100000023841858,9.300000190734863 -3,10.199999809265137 C-4,11.899999618530273 -5,13.300000190734863 -5.900000095367432,14.100000381469727 C-6.800000190734863,14.800000190734863 -7.5,15 -8,15z M-6.800000190734863,12.100000381469727 C-7.300000190734863,12.399999618530273 -7.699999809265137,12.699999809265137 -7.900000095367432,13 C-7.699999809265137,12.899999618530273 -7.300000190734863,12.699999809265137 -6.800000190734863,12.100000381469727z M6.800000190734863,7.400000095367432 C7.199999809265137,7.5 7.599999904632568,7.599999904632568 8,7.599999904632568 C8.600000381469727,7.599999904632568 8.899999618530273,7.5 9,7.5 C9,7.5 9,7.5 9,7.5 C8.899999618530273,7.400000095367432 8.199999809265137,7.199999809265137 6.800000190734863,7.400000095367432z M-0.20000000298023224,3.799999952316284 C-0.6000000238418579,5 -1.2000000476837158,6.300000190734863 -1.7000000476837158,7.5 C-0.5,7.099999904632568 0.699999988079071,6.699999809265137 1.899999976158142,6.400000095367432 C1.100000023841858,5.599999904632568 0.4000000059604645,4.699999809265137 -0.20000000298023224,3.799999952316284z M-0.800000011920929,-4 C-0.8999999761581421,-4 -0.8999999761581421,-4 -0.8999999761581421,-4 C-1,-3.9000000953674316 -1.100000023841858,-3.200000047683716 -0.699999988079071,-1.7000000476837158 C-0.6000000238418579,-2.9000000953674316 -0.6000000238418579,-3.799999952316284 -0.800000011920929,-4z"></path></g></g></g></svg>`
const file_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet"><g clip-path="url(#__lottie_element_63)"><g transform="matrix(1,0,0,1,7.75,2.75)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,16.25,21.25)"><path fill="rgb(144,201,248)" fill-opacity="1" d=" M16,21 C16,21 -16,21 -16,21 C-16,21 -16,-21 -16,-21 C-16,-21 6,-21 6,-21 C6,-21 16,-11 16,-11 C16,-11 16,21 16,21z"></path></g></g><g transform="matrix(1,0,0,1,15,21)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(24,118,210)" stroke-opacity="1" stroke-width="2" d=" M1,1 C1,1 18,1 18,1"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(24,118,210)" stroke-opacity="1" stroke-width="2" d=" M1,5 C1,5 14,5 14,5"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(24,118,210)" stroke-opacity="1" stroke-width="2" d=" M1,9 C1,9 18,9 18,9"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="10" stroke="rgb(24,118,210)" stroke-opacity="1" stroke-width="2" d=" M1,13 C1,13 14,13 14,13"></path></g></g><g transform="matrix(1,0,0,1,28.75,4.25)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,5,5)"><path fill="rgb(224,245,253)" fill-opacity="1" d=" M4.75,4.75 C4.75,4.75 -4.75,4.75 -4.75,4.75 C-4.75,4.75 -4.75,-4.75 -4.75,-4.75 C-4.75,-4.75 0,0 0,0 C0,0 4.75,4.75 4.75,4.75z"></path></g></g></g></svg>`

// Don't know new OS thing, so I just copied it from the original source code and edited something.
const Os = {
	isWindows: navigator.userAgent.toUpperCase().indexOf('WIN') > -1, // .includes
	isMac: navigator.userAgent.toUpperCase().indexOf('MAC') > -1,
	isMacLike: /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent),
	isIos: /(iPhone|iPod|iPad)/i.test(navigator.userAgent),
	isMobile: /Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

function getDocumentHeight() {
	var D = document;
	return Math.max(
		D.body.scrollHeight, D.documentElement.scrollHeight,
		D.body.offsetHeight, D.documentElement.offsetHeight,
		D.body.clientHeight, D.documentElement.clientHeight
	);
}

// get search params
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	var pair;
	for (var i = 0; i < vars.length; i++) {
		pair = vars[i].split('=');
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

function render(path) {
	if (path.indexOf("?") > 0) {
		path = path.substr(0, path.indexOf("?"));
	}
	title(path);
	nav(path);
	// .../0: This
	var reg = /\/\d+:$/g;
	if (path.includes("/fallback")) {
		// Used to store the state of some scroll events
		window.scroll_status = {
			// Whether the scroll event is bound
			event_bound: false,
			// "Scroll to the bottom, loading more data" event lock
			loading_lock: false
		};
		const can_preview = getQueryVariable('a');
		const id = getQueryVariable('id');
		if (can_preview) {
			return fallback(id, true)
		} else {
			return list(null, id, true);
		}
	} else if (window.MODEL.is_search_page) {
		// Used to store the state of some scroll events
		window.scroll_status = {
			// Whether the scroll event is bound
			event_bound: false,
			// "Scroll to the bottom, loading more data" event lock
			loading_lock: false
		};
		render_search_result_list()
	} else if (path.match(reg) || path.slice(-1) == '/') {
		// Used to store the state of some scroll events
		window.scroll_status = {
			// Whether the scroll event is bound
			event_bound: false,
			// "Scroll to the bottom, loading more data" event lock
			loading_lock: false
		};
		list(path);
	} else {
		file(path);
	}
}


// Render title
function title(path) {
	path = decodeURIComponent(path);
	var cur = window.current_drive_order || 0;
	var drive_name = window.drive_names[cur];
	path = path.replace(`/${cur}:`, '');
	// $('title').html(document.siteName + ' - ' + path);
	var model = window.MODEL;
	if (model.is_search_page)
		$('title').html(`Search: ${model.q} - ${UI.siteName}`);
	else
		$('title').html(`${drive_name}: ${path} - ${UI.siteName}`);
}

// Render the navigation bar
function nav(path) {
	var model = window.MODEL;
	var html = "";
	var cur = window.current_drive_order || 0;
	html += `<nav class="navbar navbar-expand-lg${UI.fixed_header ?' fixed-top': ''} ${UI.header_style_class} container">
    <div class="container-fluid mx-2">
  <a class="navbar-brand d-flex align-items-center gap-2" href="/">${UI.logo_image ? '<img border="0" alt="'+UI.company_name+'" src="'+UI.logo_link_name+'" height="'+UI.logo_height+'" width="'+UI.logo_width+'">'+UI.siteName : UI.logo_link_name}</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a class="nav-link" href="/${cur}:/"><i class="fas fa-home fa-fw"></i>${UI.nav_link_1}</a>
      </li>`;
	var names = window.drive_names;
	var drive_name = window.drive_names[cur];

	html += `<li class="nav-item">
    <a class="nav-link" href="${UI.contact_link}" target="_blank"><i class="fas fa-paper-plane fa-fw"></i>${UI.nav_link_4}</a>
    <li class="nav-item"><a class="nav-link" href="/login"><i class="fa-solid fa-user fa-fw"></i>Login</a></li>`;

	var search_text = model.is_search_page ? (model.q || '') : '';
	var search_bar = `
</ul>
<form class="d-flex" method="get" action="/${cur}:search">
<div class="input-group">
	<input class="form-control" name="q" type="search" placeholder="Search" aria-label="Search" value="${search_text}" style="border-right:0;" required>
	<button class="btn ${UI.search_button_class}" onclick="if($('#search_bar_form>input').val()) $('#search_bar_form').submit();" type="submit" style="border-color: rgba(140, 130, 115, 0.13); border-left:0;"><i class="fas fa-search" style="margin: 0"></i></button>
</div>
</form>
</div>
</div>
</nav>
`;

	// Personal or team
	if (model.root_type < 2) {
		// Show search box
		html += search_bar;
	}

	$('#nav').html(html);
}

// Sleep Function to Retry API Calls
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

/**
 * Initiate POST request for listing
 * @param path Path
 * @param params Form params
 * @param resultCallback Success Result Callback
 * @param authErrorCallback Pass Error Callback
 */
function requestListPath(path, params, resultCallback, authErrorCallback, retries = 3, fallback = false) {
	var requestData = {
		id: params['id'] || '',
		type: 'folder',
		password: params['password'] || '',
		page_token: params['page_token'] || '',
		page_index: params['page_index'] || 0
	};
	$('#update').show();
	document.getElementById('update').innerHTML = `<div class='alert alert-info' role='alert'> Connecting...</div></div></div>`;
	if (fallback) {
		path = "/0:fallback"
	}

	function performRequest() {
		fetch(fallback ? "/0:fallback" : path, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData)
			})
			.then(function(response) {
				if (response.status === 500) {
					document.getElementById('list').innerHTML = `<div class="text-center">
					<div class="card-body text-center">
					  <div class="${UI.file_view_alert_class}" id="file_details" role="alert"><b>500.</b> That’s an error.</div>
					</div>
					<p>The requested URL was not found on this server. That’s all we know.</p>
					<div class="card-text text-center">
					  <div class="btn-group text-center">
						<a href="/" type="button" class="btn btn-success">Homepage</a>
					  </div>
					</div><br>
				  </div>`;
					$('#update').hide();
					return 500
				}
				if (!response.ok) {
					throw new Error('Request failed');
				}
				return response.json();
			})
			.then(function(res) {
				if (res && res.error && res.error.code === 401) {
					// Password verification failed
					askPassword(path);
				} else if (res && res.data === null) {
					document.getElementById('spinner').remove();
					document.getElementById('list').innerHTML = `<div class='alert alert-danger' role='alert'> Server didn't send any data.</div></div></div>`;
					$('#update').hide();
				} else if (res && res.data) {
					resultCallback(res, path, requestData);
					$('#update').hide();
				}
			})
			.catch(function(error) {
				if (retries > 0) {
					sleep(2000);
					document.getElementById('update').innerHTML = `<div class='alert alert-info' role='alert'> Retrying...</div></div></div>`;
					performRequest(path, requestData, resultCallback, authErrorCallback, retries - 1);
				} else {
					document.getElementById('update').innerHTML = `<div class='alert alert-danger' role='alert'> Unable to get data from the server. Something went wrong.</div></div></div>`;
					document.getElementById('list').innerHTML = `<div class='alert alert-danger' role='alert'> We were unable to get data from the server. ` + error + `</div></div></div>`;
					$('#update').hide();
				}
			});
	}
	console.log("Performing Request again")
	performRequest();
}




/**
 * Search POST request
 * @param params Form params
 * @param resultCallback Success callback
 */
function requestSearch(params, resultCallback, retries = 3) {
	var p = {
		q: params['q'] || null,
		page_token: params['page_token'] || null,
		page_index: params['page_index'] || 0
	};

	function performRequest(retries) {
		fetch(`/${window.current_drive_order}:search`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(p)
			})
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Request failed');
				}
				return response.json();
			})
			.then(function(res) {
				if (res && res.data === null) {
					$('#spinner').remove();
					$('#list').html(`<div class='alert alert-danger' role='alert'> Server didn't send any data.</div></div></div>`);
					$('#update').remove();
				}
				if (res && res.data) {
					if (resultCallback) resultCallback(res, p);
					$('#update').remove();
				}
			})
			.catch(function(error) {
				if (retries > 0) {
					sleep(2000);
					$('#update').html(`<div class='alert alert-info' role='alert'> Retrying...</div></div></div>`);
					performRequest(retries - 1);
				} else {
					$('#update').html(`<div class='alert alert-danger' role='alert'> Unable to get data from the server. Something went wrong. 3 Failures</div></div></div>`);
					$('#list').html(`<div class='alert alert-danger' role='alert'> We were unable to get data from the server.</div></div></div>`);
					$('#spinner').remove();
				}
			});
	}

	$('#update').html(`<div class='alert alert-info' role='alert'> Connecting...</div></div></div>`);
	performRequest(retries);
}


// Render file list
function list(path, id = '', fallback = false) {
	console.log(id);
	var cur = window.current_drive_order || 0;
	var drive_name = window.drive_names[cur];
	var folder_name = !fallback ? decodeURIComponent(path.split('/').filter(Boolean).pop()) : 'Files';
	var folder_ico = folder_icon;
	if (folder_name === cur + ':') {
		folder_ico = gdrive_icon;
		folder_name = drive_name;
	}
	var containerContent = `
    <div id="update"></div>
    <div id="head_md" style="display:none; padding: 20px 20px;"></div>
    <div class="container" id="select_items" style="padding: 0px 50px 10px; display:none;">
      <div class="d-flex align-items-center justify-content-between">
        <div class="form-check mr-3">
          <input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" id="select-all-checkboxes">
          <label class="form-check-label" for="select-all-checkboxes">Select all</label>
        </div>
        <button id="handle-multiple-items-copy" style="padding: 5px 10px; font-size: 12px;" class="btn btn-success">Copy</button>
      </div>
    </div>
	<div class="card">
		<div class="card-header d-flex align-items-center gap-2">
			<span>${folder_ico}</span><span class="w-100 text-truncate" id="dirname">${folder_name}</span>
		</div>
		<div id="list" class="list-group list-group-flush text-break">
		</div>
		<div class="card-footer text-muted d-flex align-items-center gap-2" id="count">
			<span class="number badge text-bg-dark">0 item</span><span class="totalsize badge text-bg-dark"></span>
		</div>
	</div>
  <div id="readme_md" style="display:none; padding: 20px 20px;"></div>
</div>`;

	$('#content').html(containerContent);

	var password = localStorage.getItem('password' + path);

	$('#list').html(`<div class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
	$('#readme_md').hide().html('');
	$('#head_md').hide().html('');

	function handleSuccessResult(res, path, prevReqParams) {
		console.log(res, path, prevReqParams);
		if (fallback) {
			title(res['name']);
			$('#dirname').html(res['name']);
		}
		$('#sharer').attr('href', 'https://kaceku.onrender.com/f/' + res['fid']);
		$('#sharer').removeClass('d-none');
		$('#list')
			.data('nextPageToken', res['nextPageToken'])
			.data('curPageIndex', res['curPageIndex']);

		$('#spinner').remove();

		if (res['nextPageToken'] === null) {
			$(window).off('scroll');
			window.scroll_status.event_bound = false;
			window.scroll_status.loading_lock = false;
			if (fallback) {
				append_files_to_fallback_list(path, res['data']['files']);
			} else {
				append_files_to_list(path, res['data']['files']);
			}
		} else {
			console.log('doing something...')
			if (fallback) {
				append_files_to_fallback_list(path, res['data']['files']);
			} else {
				append_files_to_list(path, res['data']['files']);
			}
			if (window.scroll_status.event_bound !== true) {
				$(window).on('scroll', function() {
					var scrollTop = $(this).scrollTop();
					var scrollHeight = getDocumentHeight();
					var windowHeight = $(this).height();

					if (scrollTop + windowHeight > scrollHeight - (Os.isMobile ? 130 : 80)) {
						if (window.scroll_status.loading_lock === true) {
							return;
						}

						window.scroll_status.loading_lock = true;

						$(`<div id="spinner" class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`)
							.insertBefore('#readme_md');

						let $list = $('#list');
						if (fallback) {
							console.log('fallback inside handleSuccessResult');
							requestListPath(path, {
									id: id,
									password: prevReqParams['password'],
									page_token: $list.data('nextPageToken'),
									page_index: $list.data('curPageIndex') + 1
								},
								handleSuccessResult,
								null, 5, id, fallback = true);
						} else {
							requestListPath(path, {
									password: prevReqParams['password'],
									page_token: $list.data('nextPageToken'),
									page_index: $list.data('curPageIndex') + 1
								},
								handleSuccessResult,
								null);
						}
					}
				});

				window.scroll_status.event_bound = true;
			}
		}

		if (window.scroll_status.loading_lock === true) {
			window.scroll_status.loading_lock = false;
		}
	}

	if (fallback) {
		console.log('fallback inside list');
		requestListPath(path, {
				id: id,
				password: password
			},
			handleSuccessResult,
			null, null, fallback = true);
	} else {
		console.log("handling this")
		requestListPath(path, {
				password: password
			},
			handleSuccessResult,
			null);
	}


	const copyBtn = document.getElementById("handle-multiple-items-copy");

	// Add a click event listener to the copy button
	copyBtn.addEventListener("click", () => {
		// Get all the checked checkboxes
		const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked');

		// Create an array to store the selected items' data
		const selectedItemsData = [];

		// Loop through each checked checkbox
    if (checkedItems.length === 0) {
      alert("No items selected!");
      return;
    }
		checkedItems.forEach((item) => {
			// Get the value of the checkbox (in this case, the URL)
			const itemData = item.value;
			// Push the value to the array
			selectedItemsData.push(itemData);
		});

		// Join the selected items' data with a newline character
		const dataToCopy = selectedItemsData.join("\n");

		// Create a temporary input element
		const tempInput = document.createElement("textarea");
		tempInput.value = dataToCopy;

		// Add the temporary input element to the document
		document.body.appendChild(tempInput);

		// Select the text inside the temporary input element
		tempInput.select();

		// Copy the selected text to the clipboard
		document.execCommand("copy");

		// Remove the temporary input element from the document
		document.body.removeChild(tempInput);

		// Alert the user that the data has been copied
		alert("Selected items copied to clipboard!");
	});
}

function askPassword(path) {
	$('#spinner').remove();
	var passwordInput = prompt("Directory encryption, please enter the password", "");
	localStorage.setItem('password' + path, passwordInput);

	if (passwordInput != null && passwordInput != "") {
		list(path);
	} else {
		history.go(-1);
	}
}

/**
 * Append the data of the requested new page to the list
 * @param path
 * @param files request result
 */
function append_files_to_fallback_list(path, files) {
	try {
		console.log('append_files_to_fallback_list');
		var $list = $('#list');
		// Is it the last page of data?
		var is_lastpage_loaded = null === $list.data('nextPageToken');
		var is_firstpage = '0' == $list.data('curPageIndex');

		html = "";
		let targetFiles = [];
		var totalsize = 0;
		var is_file = false
		if (files.length == 0) {
			html = `<div class="card-body"><div class="d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4">
						<span><i class="fa-solid fa-heart-crack fa-2xl me-0"></i></span>
						<span>This folder is empty</span>
					</div></div>`;
		}
		for (i in files) {
			var item = files[i];
			var p = "/fallback?id=" + item.id
			item['createdTime'] = utc2jakarta(item['createdTime']);
			// replace / with %2F
			if (item['mimeType'] == 'application/vnd.google-apps.folder') {
				html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2"><a href="${p}" style="color: ${UI.folder_text_color};" class="countitems w-100 d-flex align-items-start align-items-xl-center gap-2"><span>${folder_icon}</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-dark-info-transparent my-1 text-center" style="min-width: 85px;">—</span>` : ``}<span class="d-flex gap-2">
				${UI.display_download ? `<a class="d-flex align-items-center" href="${p}" title="via Index"><i class="far fa-folder-open fa-lg"></i></a>` : ``}</span></div>`;
			} else {
				var totalsize = totalsize + Number(item.size || 0);
				item['size'] = formatFileSize(item['size']) || '—';
				var is_file = true
				var epn = item.name;
				var link = UI.random_domain_for_dl ? UI.downloaddomain + item.link : window.location.origin + item.link;
				var pn = path + epn.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
				var c = "file";
				// README is displayed after the last page is loaded, otherwise it will affect the scroll event
				if (is_lastpage_loaded && item.name == "README.md" && UI.render_readme_md) {
					get_file(p, item, function(data) {
						markdown("#readme_md", data);
						$("img").addClass("img-fluid")
					});
				}
				if (item.name == "HEAD.md" && UI.render_head_md) {
					get_file(p, item, function(data) {
						markdown("#head_md", data);
						$("img").addClass("img-fluid")
					});
				}
				var ext = item.fileExtension
				//if ("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".indexOf(`|${ext}|`) >= 0) {
				//targetFiles.push(filepath);
				pn += "?a=view";
				c += " view";
				//}
				html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2">${UI.allow_selecting_files ? '<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" value="'+link+'" id="flexCheckDefault">' : ''}<a class="countitems size_items w-100 d-flex align-items-start align-items-xl-center gap-2" style="text-decoration: none; color: ${UI.css_a_tag_color};" href="${p}&a=view"><span>`

				if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
					html += video_icon
				} else if ("|html|php|css|go|java|js|json|txt|sh|".indexOf(`|${ext}|`) >= 0) {
					html += code_icon
				} else if ("|zip|rar|tar|.7z|.gz|".indexOf(`|${ext}|`) >= 0) {
					html += zip_icon
				} else if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
					html += image_icon
				} else if ("|m4a|mp3|flac|wav|ogg|".indexOf(`|${ext}|`) >= 0) {
					html += audio_icon
				} else if ("|md|".indexOf(`|${ext}|`) >= 0) {
					html += markdown_icon
				} else if ("|pdf|".indexOf(`|${ext}|`) >= 0) {
					html += pdf_icon
				} else if (item.mimeType.startsWith('application/vnd.google-apps.')) {
					html += `<img src="${item.iconLink}" class="d-flex" style="width: 1.24rem; margin-left: 0.12rem; margin-right: 0.12rem;">`
				} else {
					html += file_icon
				}

				html += `</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-primary my-1 ${item['size'] == '—' ? 'text-center' : 'text-end'}" style="min-width: 85px;">` + item['size'] + `</span>` : ``}<span class="d-flex gap-2">
				${UI.display_download ? `<a class="d-flex align-items-center" href="${link}" title="via Index"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="currentColor" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path></svg></a>` : ``}</span></div>`;
			}
		}
		if (is_file && UI.allow_selecting_files) {
			document.getElementById('select_items').style.display = 'block';
		}


		/*let targetObj = {};
		targetFiles.forEach((myFilepath, myIndex) => {
		    if (!targetObj[myFilepath]) {
		        targetObj[myFilepath] = {
		            filepath: myFilepath,
		            prev: myIndex === 0 ? null : targetFiles[myIndex - 1],
		            next: myIndex === targetFiles.length - 1 ? null : targetFiles[myIndex + 1],
		        }
		    }
		})
		// console.log(targetObj)
		if (Object.keys(targetObj).length) {
		    localStorage.setItem(path, JSON.stringify(targetObj));
		    // console.log(path)
		}*/

		if (targetFiles.length > 0) {
			let old = localStorage.getItem(path);
			let new_children = targetFiles;
			// Reset on page 1; otherwise append
			if (!is_firstpage && old) {
				let old_children;
				try {
					old_children = JSON.parse(old);
					if (!Array.isArray(old_children)) {
						old_children = []
					}
				} catch (e) {
					old_children = [];
				}
				new_children = old_children.concat(targetFiles)
			}

			localStorage.setItem(path, JSON.stringify(new_children))
		}

		// When it is page 1, remove the horizontal loading bar
		$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
		// When it is the last page, count and display the total number of items
		if (is_lastpage_loaded) {
			total_size = formatFileSize(totalsize) || '0 Bytes';
			total_items = $list.find('.countitems').length;
			total_files = $list.find('.size_items').length;
			if (total_items == 0) {
				$('#count').removeClass('d-none').find('.number').text("0 item");
			} else if (total_items == 1) {
				$('#count').removeClass('d-none').find('.number').text(total_items + " item");
			} else {
				$('#count').removeClass('d-none').find('.number').text(total_items + " items");
			}
			if (total_files == 0) {
				$('#count').removeClass('d-none').find('.totalsize').text("0 file");
			} else if (total_files == 1) {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " file, total: " + total_size);
			} else {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " files, total: " + total_size);
			}
		}
	} catch (e) {
		console.log(e);
	}
}

/**
 * Append the data of the requested new page to the list
 * @param path
 * @param files request result
 */
function append_files_to_list(path, files) {
	var $list = $('#list');
	// Is it the last page of data?
	var is_lastpage_loaded = null === $list.data('nextPageToken');
	var is_firstpage = '0' == $list.data('curPageIndex');

	html = "";
	let targetFiles = [];
	var totalsize = 0;
	var is_file = false
	if (files.length == 0) {
		html = `<div class="card-body"><div class="d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4">
					<span><i class="fa-solid fa-heart-crack fa-2xl me-0"></i></span>
					<span>This folder is empty</span>
				</div></div>`;
	}
	for (i in files) {
		var item = files[i];
		var ep = encodeURIComponent(item.name).replace(/\//g, '%2F') + '/';
		var p = path + ep.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
		item['createdTime'] = utc2jakarta(item['createdTime']);
		// replace / with %2F
		if (item['mimeType'] == 'application/vnd.google-apps.folder') {
			html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2"><a href="${p}" style="color: ${UI.folder_text_color};" class="countitems w-100 d-flex align-items-start align-items-xl-center gap-2"><span>${folder_icon}</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}<span class="d-flex gap-2">
			${UI.display_download ? `<a class="d-flex align-items-center" href="${p}" title="via Index"><i class="far fa-folder-open fa-lg"></i></a>` : ``}</span></div>`;
		} else {
			var totalsize = totalsize + Number(item.size || 0);
			item['size'] = formatFileSize(item['size']) || '—';
			var is_file = true
			var epn = item.name;
			var link = UI.random_domain_for_dl ? UI.downloaddomain + item.link : window.location.origin + item.link;
			var pn = path + epn.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
			var c = "file";
			// README is displayed after the last page is loaded, otherwise it will affect the scroll event
			if (is_lastpage_loaded && item.name == "README.md" && UI.render_readme_md) {
				get_file(p, item, function(data) {
					markdown("#readme_md", data);
					$("img").addClass("img-fluid")
				});
			}
			if (item.name == "HEAD.md" && UI.render_head_md) {
				get_file(p, item, function(data) {
					markdown("#head_md", data);
					$("img").addClass("img-fluid")
				});
			}
			var ext = item.fileExtension
			//if ("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".indexOf(`|${ext}|`) >= 0) {
			//targetFiles.push(filepath);
			pn += "?a=view";
			c += " view";
			//}
			html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2">${UI.allow_selecting_files ? '<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" value="'+link+'" id="flexCheckDefault">' : ''}<a class="countitems size_items w-100 d-flex align-items-start align-items-xl-center gap-2" style="text-decoration: none; color: ${UI.css_a_tag_color};" href="${pn}"><span>`

			if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
				html += video_icon
			} else if ("|html|php|css|go|java|js|json|txt|sh|".indexOf(`|${ext}|`) >= 0) {
				html += code_icon
			} else if ("|zip|rar|tar|.7z|.gz|".indexOf(`|${ext}|`) >= 0) {
				html += zip_icon
			} else if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
				html += image_icon
			} else if ("|m4a|mp3|flac|wav|ogg|".indexOf(`|${ext}|`) >= 0) {
				html += audio_icon
			} else if ("|md|".indexOf(`|${ext}|`) >= 0) {
				html += markdown_icon
			} else if ("|pdf|".indexOf(`|${ext}|`) >= 0) {
				html += pdf_icon
			} else if (item.mimeType.startsWith('application/vnd.google-apps.')) {
				html += `<img src="${item.iconLink}" class="d-flex" style="width: 1.24rem; margin-left: 0.12rem; margin-right: 0.12rem;">`
			} else {
				html += file_icon
			}

			html += `</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-primary my-1 ${item['size'] == '—' ? 'text-center' : 'text-end'}" style="min-width: 85px;">` + item['size'] + `</span>` : ``}<span class="d-flex gap-2">
	    ${UI.display_download ? `<a class="d-flex align-items-center" href="${link}" title="via Index"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="currentColor" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path></svg></a>` : ``}</span></div>`;
		}
	}
	if (is_file && UI.allow_selecting_files) {
		document.getElementById('select_items').style.display = 'block';
	}


	/*let targetObj = {};
	targetFiles.forEach((myFilepath, myIndex) => {
	    if (!targetObj[myFilepath]) {
	        targetObj[myFilepath] = {
	            filepath: myFilepath,
	            prev: myIndex === 0 ? null : targetFiles[myIndex - 1],
	            next: myIndex === targetFiles.length - 1 ? null : targetFiles[myIndex + 1],
	        }
	    }
	})
	// console.log(targetObj)
	if (Object.keys(targetObj).length) {
	    localStorage.setItem(path, JSON.stringify(targetObj));
	    // console.log(path)
	}*/

	if (targetFiles.length > 0) {
		let old = localStorage.getItem(path);
		let new_children = targetFiles;
		// Reset on page 1; otherwise append
		if (!is_firstpage && old) {
			let old_children;
			try {
				old_children = JSON.parse(old);
				if (!Array.isArray(old_children)) {
					old_children = []
				}
			} catch (e) {
				old_children = [];
			}
			new_children = old_children.concat(targetFiles)
		}

		localStorage.setItem(path, JSON.stringify(new_children))
	}

	// When it is page 1, remove the horizontal loading bar
	$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
	// When it is the last page, count and display the total number of items
	if (is_lastpage_loaded) {
		total_size = formatFileSize(totalsize) || '0 Bytes';
		total_items = $list.find('.countitems').length;
		total_files = $list.find('.size_items').length;
		if (total_items == 0) {
			$('#count').removeClass('d-none').find('.number').text("0 item");
		} else if (total_items == 1) {
			$('#count').removeClass('d-none').find('.number').text(total_items + " item");
		} else {
			$('#count').removeClass('d-none').find('.number').text(total_items + " items");
		}
		if (total_files == 0) {
			$('#count').removeClass('d-none').find('.totalsize').text("0 file");
		} else if (total_files == 1) {
			$('#count').removeClass('d-none').find('.totalsize').text(total_files + " file, total: " + total_size);
		} else {
			$('#count').removeClass('d-none').find('.totalsize').text(total_files + " files, total: " + total_size);
		}
	}
}

/**
 * Render the search results list. There is a lot of repetitive code, but there are different logics in it.
 */
function render_search_result_list() {
	var model = window.MODEL;
	
	// Add search bar to the card header with white background
	var searchBar = `
	<form class="d-flex mt-2" method="get" action="/${window.current_drive_order}:search">
		<div class="input-group">
			<input class="form-control bg-white text-dark" name="q" type="search" placeholder="Search to Type Movies Name + Year" aria-label="Search" value="${model.q}" style="border-right:0;" required>
			  <button class="btn btn-success" type="submit" style="border-color: rgba(140, 130, 115, 0.13); border-left:0;">
				<i class="fas fa-search" style="margin: 0"></i>
			</button>
		</div>
	</form>`;
	
	var content = `
  	<div id="update"></div>
	<div class="container" id="select_items" style="padding: 0px 50px 10px; display:none;">
		<div class="d-flex align-items-center justify-content-between">
			<div class="form-check mr-3">
			<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" id="select-all-checkboxes">
			<label class="form-check-label" for="select-all-checkboxes">Select all</label>
			</div>
			<button id="handle-multiple-items-copy" style="padding: 5px 10px; font-size: 12px;" class="btn btn-success">Copy</button>
		</div>
	</div>
	<div class="card">
		<div class="card-header">
			<div class="text-truncate"><i class="fas fa-search fa-fw"></i> Search: <code>${model.q}</code></div>
			${searchBar}
		</div>
		<div id="list" class="list-group list-group-flush text-break">
		</div>
		<div class="card-footer text-muted d-flex align-items-center gap-2" id="count"><span class="number badge text-bg-dark">0 item</span><span class="totalsize badge text-bg-dark"></span></div>
	</div>
	<div id="readme_md" style="display:none; padding: 20px 20px;"></div>`;
	$('#content').html(content);

	$('#list').html(`<div class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
	$('#readme_md').hide().html('');
	$('#head_md').hide().html('');

	/**
	 * Callback after successful search request returns data
	 * The result returned by @param res (object)
	 * @param path the requested path
	 * @param prevReqParams parameters used in request
	 */
	function searchSuccessCallback(res, prevReqParams) {

		// Temporarily store nextPageToken and currentPageIndex in the list element
		$('#list')
			.data('nextPageToken', res['nextPageToken'])
			.data('curPageIndex', res['curPageIndex']);

		// Remove loading spinner
		$('#spinner').remove();

		if (res['nextPageToken'] === null) {
			// If it is the last page, unbind the scroll event, reset scroll_status, and append the data
			$(window).off('scroll');
			window.scroll_status.event_bound = false;
			window.scroll_status.loading_lock = false;
			append_search_result_to_list(res['data']['files']);
		} else {
			// If it is not the last page, append data and bind the scroll event (if not already bound), update scroll_status
			append_search_result_to_list(res['data']['files']);
			if (window.scroll_status.event_bound !== true) {
				// Bind event, if not yet bound
				$(window).on('scroll', function() {
					var scrollTop = $(this).scrollTop();
					var scrollHeight = getDocumentHeight();
					var windowHeight = $(this).height();
					// Roll to the bottom
					if (scrollTop + windowHeight > scrollHeight - (Os.isMobile ? 130 : 80)) {
						/*
     When the event of scrolling to the bottom is triggered, if it is already loading at this time, the event is ignored;
                 Otherwise, go to loading and occupy the loading lock, indicating that loading is in progress
             */
						if (window.scroll_status.loading_lock === true) {
							return;
						}
						window.scroll_status.loading_lock = true;

						// Show a loading spinner
						$(`<div id="spinner" class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`)
							.insertBefore('#readme_md');

						let $list = $('#list');
						requestSearch({
								q: window.MODEL.q,
								page_token: $list.data('nextPageToken'),
								// Request next page
								page_index: $list.data('curPageIndex') + 1
							},
							searchSuccessCallback
						)
					}
				});
				window.scroll_status.event_bound = true
			}
		}

		// After loading successfully and rendering new data successfully, release the loading lock so that you can continue to process the "scroll to bottom" event
		if (window.scroll_status.loading_lock === true) {
			window.scroll_status.loading_lock = false
		}
	}

	// Start requesting data from page 1
	requestSearch({
		q: window.MODEL.q
	}, searchSuccessCallback);

	const copyBtn = document.getElementById("handle-multiple-items-copy");

	// Add a click event listener to the copy button
	copyBtn.addEventListener("click", () => {
		// Get all the checked checkboxes
		const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked');

		// Create an array to store the selected items' data
		const selectedItemsData = [];
    if (checkedItems.length === 0) {
      alert("No items selected!");
      return;
    }
		// Loop through each checked checkbox
		checkedItems.forEach((item) => {
			// Get the value of the checkbox (in this case, the URL)
			const itemData = item.value;
			// Push the value to the array
			selectedItemsData.push(itemData);
		});

		// Join the selected items' data with a newline character
		const dataToCopy = selectedItemsData.join("\n");

		// Create a temporary input element
		const tempInput = document.createElement("textarea");
		tempInput.value = dataToCopy;

		// Add the temporary input element to the document
		document.body.appendChild(tempInput);

		// Select the text inside the temporary input element
		tempInput.select();

		// Copy the selected text to the clipboard
		document.execCommand("copy");

		// Remove the temporary input element from the document
		document.body.removeChild(tempInput);

		// Alert the user that the data has been copied
		alert("Selected items copied to clipboard!");
	});
}

/**
 * Append a new page of search results
 * @param files
 */
function append_search_result_to_list(files) {
	try {
		var cur = window.current_drive_order || 0;
		var $list = $('#list');
		// Is it the last page of data?
		var is_lastpage_loaded = null === $list.data('nextPageToken');
		// var is_firstpage = '0' == $list.data('curPageIndex');

		// Sort files by size in descending order (largest first)
		files.sort((a, b) => {
			const sizeA = parseInt(a.size || 0);
			const sizeB = parseInt(b.size || 0);
			return sizeB - sizeA;
		});

		html = "";
		var totalsize = 0;
		var is_file = false;
		for (i in files) {
			var item = files[i];
			
			// Skip folders in search results
			if (item['mimeType'] == 'application/vnd.google-apps.folder') {
				continue; // This will skip the rest of the loop for this item
			}
			
			if (item['size'] == undefined) {
				item['size'] = "";
			}
			item['createdTime'] = utc2jakarta(item['createdTime']);
			
			// Only process files (folders are skipped above)
			var is_file = true;
			var totalsize = totalsize + Number(item.size || 0);
			item['size'] = formatFileSize(item['size']) || '—';
			item['md5Checksum'] = item['md5Checksum'] || '—';
			var ext = item.fileExtension;
			var link = UI.random_domain_for_dl ? UI.downloaddomain + item.link : window.location.origin + item.link;
			html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2" gd-type="$item['mimeType']}">${UI.allow_selecting_files ? '<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" value="'+link+'" id="flexCheckDefault">' : ''}<a href="#" onclick="onSearchResultItemClick('${item['id']}', true, ${JSON.stringify(item).replace(/"/g, "&quot;")})" data-bs-toggle="modal" data-bs-target="#SearchModel" class="countitems size_items w-100 d-flex align-items-start align-items-xl-center gap-2" style="text-decoration: none; color: ${UI.css_a_tag_color};"><span>`

			if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
				html += video_icon
			} else if ("|html|php|css|go|java|js|json|txt|sh|".indexOf(`|${ext}|`) >= 0) {
				html += code_icon
			} else if ("|zip|rar|tar|.7z|.gz|".indexOf(`|${ext}|`) >= 0) {
				html += zip_icon
			} else if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
				html += image_icon
			} else if ("|m4a|mp3|flac|wav|ogg|".indexOf(`|${ext}|`) >= 0) {
				html += audio_icon
			} else if ("|md|".indexOf(`|${ext}|`) >= 0) {
				html += markdown_icon
			} else if ("|pdf|".indexOf(`|${ext}|`) >= 0) {
				html += pdf_icon
			} else if (item.mimeType.startsWith('application/vnd.google-apps.')) {
				html += `<img src="${item.iconLink}" class="d-flex" style="width: 1.24rem; margin-left: 0.12rem; margin-right: 0.12rem;">`
			} else {
				html += file_icon
			}

			html += `</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-primary my-1 ${item['size'] == '—' ? 'text-center' : 'text-end'}" style="min-width: 85px;">` + item['size'] + `</span>` : ``}<span class="d-flex gap-2">
			${UI.display_download ? `<a class="d-flex align-items-center" href="${link}" title="via Index"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path></svg></a>` : ``}</span></div>`;
		}
		if (is_file && UI.allow_selecting_files) {
			document.getElementById('select_items').style.display = 'block';
		}
		// When it is page 1, remove the horizontal loading bar
		$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
		// When it is the last page, count and display the total number of items
		if (is_lastpage_loaded) {
			total_size = formatFileSize(totalsize) || '0 Bytes';
			total_items = $list.find('.countitems').length;
			total_files = $list.find('.size_items').length;
			if (total_items == 0) {
				$('#count').removeClass('d-none').find('.number').text("0 item");
			} else if (total_items == 1) {
				$('#count').removeClass('d-none').find('.number').text(total_items + " item");
			} else {
				$('#count').removeClass('d-none').find('.number').text(total_items + " items");
			}
			if (total_files == 0) {
				$('#count').removeClass('d-none').find('.totalsize').text("0 file");
			} else if (total_files == 1) {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " file, total: " + total_size);
			} else {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " files, total: " + total_size);
			}
		}
	} catch (e) {
		console.log(e);
	}
}

// Optimized - Same working URL, instant display
async function onSearchResultItemClick(file_id, can_preview, file) {
    var cur = window.current_drive_order;
    
    // Set title immediately
    var title = `<i class="fas fa-file-alt fa-fw"></i> File Information`;
    $('#SearchModelLabel').html(title);
    
    var p = {
        id: file_id
    };
    
    // Create the direct URL (this is what actually works!)
    const encodedFileId = file_id;
    const directUrl = `${window.location.origin}/fallback?id=${encodedFileId}${can_preview ? '&a=view' : ''}`;

    // Function to check if browser is Chrome
    function isChromeBrowser() {
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    }
    
    // Function to open in Chrome - use the direct URL
    function getChromeOpenUrl() {
        if (/Android/i.test(navigator.userAgent)) {
            // Android intent to open direct URL in Chrome
            return `intent://${directUrl.replace(/https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        } else {
            // Use direct URL for desktop
            return directUrl;
        }
    }
    
    // Generate content immediately
    let content = `
    <table class="table table-dark" style="margin-bottom: 0 !important;">
        <tbody>
            <tr>
                <th>
                    <i class="fa-regular fa-folder-closed fa-fw"></i>
                    <span class="tth">Name</span>
                </th>
                <td>${file['name']}</td>
            </tr>
            <tr>
                <th>
                    <i class="fa-regular fa-clock fa-fw"></i>
                    <span class="tth">Datetime</span>
                </th>
                <td>${file['createdTime']}</td>
            </tr>
            <tr>
                <th>
                    <i class="fa-solid fa-tag fa-fw"></i>
                    <span class="tth">Type</span>
                </th>
                <td>${file['mimeType']}</td>
            </tr>`;
    
    if (file['mimeType'] !== 'application/vnd.google-apps.folder') {
        content += `
            <tr>
                <th>
                    <i class="fa-solid fa-box-archive fa-fw"></i>
                    <span class="tth">Size</span>
                </th>
                <td>${file['size']}</td>
            </tr>`;
    }
    content += `
        </tbody>
    </table>`;
    
    // Create Chrome button HTML with direct URL (exact same as working version)
    const chromeButtonHtml = `
        <a href="${getChromeOpenUrl()}" 
           class="btn btn-info d-flex align-items-center gap-2" 
           target="_blank"
           title="𝗢𝗽𝗲𝗻 𝗶𝗻 𝗖𝗵𝗿𝗼𝗺𝗲">
            <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="Chrome" style="height: 20px; width: 20px;">
            𝗢𝗽𝗲𝗻 𝗶𝗻 𝗖𝗵𝗿𝗼𝗺𝗲 (Direct)  
        </a>`;
    
    var close_btn = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">𝗖𝗹𝗼𝘀𝗲</button>`;
    
    // Display everything immediately - no waiting!
    $('#modal-body-space').html(content);
    $('#modal-body-space-buttons').html(chromeButtonHtml + close_btn);
    
    // Apply styles immediately
    $('#modal-body-space').attr('style', 'padding-bottom: 0 !important; margin-bottom: 0 !important; border-bottom: none !important;');
    $('#modal-body-space-buttons').attr('style', 'padding-top: 10px !important; margin-top: 0 !important; border-top: none !important; text-align: center !important; display: flex !important; justify-content: center !important; gap: 10px !important;');
    
    // Optional: Request path in background (not needed for the button, but kept if you use it elsewhere)
    fetch(`/${cur}:id2path`, {
        method: 'POST',
        body: JSON.stringify(p),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Request failed.');
        }
    })
    .then(function(obj) {
        var href = `${obj.path}`;
        var encodedUrl = href.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
        console.log('Path retrieved:', encodedUrl);
        // Path available if needed for other purposes
    })
    .catch(function(error) {
        console.log('Path fetch error:', error);
        // Modal already displayed, so error doesn't affect user
    });
}

function get_file(path, file, callback) {
	var key = "file_path_" + path + file['createdTime'];
	var data = localStorage.getItem(key);
	if (data != undefined) {
		return callback(data);
	} else {
		$.get(path, function(d) {
			localStorage.setItem(key, d);
			callback(d);
		});
	}
}

async function fallback(id, type) {
	if (type) { // is a file id
		var cookie_folder_id = await getCookie("root_id") || '';
		$('#content').html(`<div class="d-flex justify-content-center" style="height: 150px"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
		fetch("/0:fallback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id
				}),
			})
			.then(function(response) {
				if (!response.ok) {
					throw new Error("Request failed");
				}
				return response.json();
			})
			.then(function(obj) {
				console.log(obj);
				title(obj.name);
				const mimeType = obj.mimeType;
				const fileExtension = obj.fileExtension ? obj.fileExtension.toLowerCase() : 'GoogleApps';
				const createdTime = utc2jakarta(obj.createdTime);
				const code = ["php", "css", "go", "java", "js", "json", "txt", "sh", "md", "html", "xml", "py", "rb", "c", "cpp", "h", "hpp"];
				const video = ["mp4", "webm", "avi", "mpg", "mpeg", "mkv", "rm", "rmvb", "mov", "wmv", "asf", "ts", "flv", "3gp", "m4v"];
				const audio = ["mp3", "flac", "wav", "ogg", "m4a", "aac", "wma", "alac"];
				if (mimeType === "application/vnd.google-apps.folder") {
					window.location.href = window.location.pathname + "/";
				} else if (fileExtension) {
					const name = obj.name;
					const bytes = obj.size || 0;
					const md5Checksum = obj.md5Checksum || '—';
					const size = formatFileSize(obj.size) || '—';
					const encoded_name = encodeURIComponent(name);
					const url = UI.random_domain_for_dl ? UI.downloaddomain + obj.link : window.location.origin + obj.link;
					const file_id = obj.fid;
					var poster = obj.thumbnailLink ? obj.thumbnailLink.replace("s220", "s0") : null;
					if (mimeType.includes("video") || video.includes(fileExtension)) {
						var poster = obj.thumbnailLink ? poster : UI.poster;
						file_video(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					} else if (mimeType.includes("audio") || audio.includes(fileExtension)) {
						file_audio(name, encoded_name, size, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					} else if (code.includes(fileExtension)) {
						file_code(name, encoded_name, size, bytes, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					} else {
						file_others(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					}
				}
			})
			.catch(function(error) {
				var content = `
				<div class="card">
					<div class="card-header ${UI.file_view_alert_class}">
						<i class="fas fa-file-alt fa-fw"></i>File Information
					</div>
					<div class="card-body text-center">
						<div class="${UI.file_view_alert_class}" id="file_details" role="alert"><b>404.</b> That’s an error. ` + error + `</div>
						<p>The requested URL was not found on this server. That’s all we know.</p>
						<a href="/" type="button" class="btn btn-success"><i class="fas fa-home fa-fw"></i>Home</a>
					</div>
				</div>`;
				$("#content").html(content);
			});
	} else { // is a folder id
		return list(id, true);
	}
}

// File display ?a=view
async function file(path) {
	var cookie_folder_id = await getCookie("root_id") || '';
	var name = path.split('/').pop();
	$('#content').html(`<div class="d-flex justify-content-center" style="height: 150px"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
	fetch("", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				path: path
			}),
		})
		.then(function(response) {
			if (!response.ok) {
				throw new Error("Request failed");
			}
			return response.json();
		})
		.then(function(obj) {
			console.log(obj);
			const mimeType = obj.mimeType;
			const createdTime = utc2jakarta(obj.createdTime);
			const fileExtension = obj.fileExtension ? obj.fileExtension.toLowerCase() : 'GoogleApps';
			const code = ["php", "css", "go", "java", "js", "json", "txt", "sh", "md", "html", "xml", "py", "rb", "c", "cpp", "h", "hpp"];
			const video = ["mp4", "webm", "avi", "mpg", "mpeg", "mkv", "rm", "rmvb", "mov", "wmv", "asf", "ts", "flv", "3gp", "m4v"];
			const audio = ["mp3", "flac", "wav", "ogg", "m4a", "aac", "wma", "alac"];
			if (mimeType === "application/vnd.google-apps.folder") {
				window.location.href = window.location.pathname + "/";
			} else if (fileExtension) {
				const name = obj.name;
				const bytes = obj.size || 0;
				const md5Checksum = obj.md5Checksum || '—';
				const size = formatFileSize(obj.size) || '—';
				const encoded_name = encodeURIComponent(name);
				const url = UI.random_domain_for_dl ? UI.downloaddomain + obj.link : window.location.origin + obj.link;
				const file_id = obj.fid;
				var poster = obj.thumbnailLink ? obj.thumbnailLink.replace("s220", "s0") : null;
				if (mimeType.includes("video") || video.includes(fileExtension)) {
					var poster = obj.thumbnailLink ? poster : UI.poster;
					file_video(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				} else if (mimeType.includes("audio") || audio.includes(fileExtension)) {
					file_audio(name, encoded_name, size, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				} else if (code.includes(fileExtension)) {
					file_code(name, encoded_name, size, bytes, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				} else {
					file_others(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				}
			}
		})
		.catch(function(error) {
			var content = `
			<div class="card">
				<div class="card-header ${UI.file_view_alert_class}">
					<i class="fas fa-file-alt fa-fw"></i>File Information
				</div>
				<div class="card-body text-center">
					<div class="${UI.file_view_alert_class}" id="file_details" role="alert"><b>404.</b> That’s an error. ` + error + `</div>
					<p>The requested URL was not found on this server. That’s all we know.</p>
					<a href="/" type="button" class="btn btn-success"><i class="fas fa-home fa-fw"></i>Home</a>
				</div>
			</div>`;
			$("#content").html(content);
		});
   }

const TamizhanWidget = `<div class="col-md-12">
<div class="card" style="padding: 0 0 0.3rem 0;border-radius:.5rem;width:100%;overflow:hidden;">
  <div style="display: flex; justify-content: center; align-items: center; height: 40px; overflow: hidden;">
    <marquee behavior="scroll" direction="left" scrollamount="6" style="color:white; font-weight:bold; font-size: 16px; text-shadow: 0 0 5px rgba(0,0,0,0.7); line-height: 40px; width: 100%;">
      ִֶָ 𓂃˖˳·˖ ִֶָ ⋆🌷͙⋆ ִֶָ˖·˳˖𓂃 ִֶָ&nbsp;&nbsp;&nbsp;வணக்கம்&nbsp;&nbsp;&nbsp;நண்பர்களே,&nbsp;&nbsp;&nbsp;⋆.˚🦋༘⋆&nbsp;&nbsp;&nbsp;தமிழன்&nbsp;&nbsp;&nbsp;திரைப்படங்களுக்கு&nbsp;&nbsp;&nbsp;˙✧˖°🍿 ༘ 🎬⋆｡°&nbsp;&nbsp;&nbsp;உங்களை&nbsp;&nbsp;&nbsp;அன்புடன்&nbsp;&nbsp;&nbsp;வரவேற்கிறோம்!&nbsp;&nbsp;&nbsp;⊱🪷⊰˚&nbsp;&nbsp;&nbsp;உங்கள்&nbsp;&nbsp;&nbsp;அன்பு&nbsp;&nbsp;&nbsp;மற்றும்&nbsp;&nbsp;&nbsp;ஆதரவுக்கு&nbsp;&nbsp;&nbsp;நன்றி.&nbsp;&nbsp;&nbsp;༄˖°.🍂.ೃ࿔*:･🙌
    </marquee>
  </div>
</div>
</div>`;

const copyButton = `<button onclick="copyFunction()" onmouseout="outFunc()" class="btn btn-primary"><span class="tooltiptext" id="myTooltip"><i class="fas fa-copy fa-fw"></i>Copy</span></button>`

function generateCopyFileBox(file_id, cookie_folder_id) {
	const copyFileBox = `<div class="row justify-content-center mt-3" id="copyresult">
  <div class="col-12 col-md-8" id="copystatus"><div class='alert alert-secondary' role='alert'> Send Request to Copy File </div></div>
  <div class="col-12 col-md-8"> <input id="user_folder_id" type="text" class="form-control" placeholder="Enter Your Folder ID to Copy this File" value="${cookie_folder_id}" required></div>
  <div class="col-12 col-md-8 mt-2"> <button id="copy_file" onclick="copyFile('${file_id}')" style="margin-top: 5px;" class="btn btn-danger btn-block">Copy File to Own Drive</button></div>
  </div>`;

	return copyFileBox;
}

// Document display |zip|.exe/others direct downloads
function file_others(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';

	// Add the container and card elements // wait until image is loaded and then hide spinner
	var content = `
	<div class="card">
		<div class="card-header ${UI.file_view_alert_class}">
			<i class="fas fa-file-alt fa-fw"></i>File Information
		</div>
		<div class="card-body row g-3">
			<div class="col-lg-4 col-md-12">${poster && !mimeType.startsWith('application/vnd.google-apps') ? `
				<div id="preview" class="h-100 border border-dark rounded d-flex justify-content-center align-items-center position-relative" style="--bs-border-opacity: .5; min-height: 200px;">
					<div id="preview_spinner" class="spinner-border m-5" role="status"><span class="sr-only"></span></div>
					<div id="overlay" class="overlay border border-dark rounded d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5; opacity: 0;">
						<span><i class="fas fa-search-plus fa-2xl fa-fw"></i></span>
						<span>Preview</span>
						<a href="#" class="stretched-link" data-bs-toggle="modal" data-bs-target="#SearchModel" title="Thumbnail of ${name}"></a>
					</div>
				</div>` : `
				<div class="h-100 border border-dark rounded d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5;">
					<span><img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/zip-icon.png" alt="Zip Icon" style="max-width: 200px; height: auto; object-fit: contain;"></span>
					<span><a href="https://telegram.me/tamizhan_updates/51" target="_blank" style="text-decoration: none; color: #00d4ff;">👉🏻 How to Extract Zip file ✅</a></span>
				</div>`}
			</div>
			<div class="col-lg-8 col-md-12">
				<table class="table table-dark">
					<tbody>
						<tr>
							<th>
								<i class="fa-regular fa-folder-closed fa-fw"></i>
								<span class="tth">Name</span>
							</th>
							<td>${name}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-regular fa-clock fa-fw"></i>
								<span class="tth">Datetime</span>
							</th>
							<td>${createdTime}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-tag fa-fw"></i>
								<span class="tth">Type</span>
							</th>
							<td>${formatMimeType(mimeType)}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-box-archive fa-fw"></i>
                <span class="tth">Size</span>
                </th>
                <td>${size}</td>
               </td>
						</tr>
					</tbody>
				</table>
       ${UI.disable_video_download ? `` : `
      <div class="col-md-12">
        <div class="text-center">
          <p class="mb-2">🚀&nbsp;𝔽𝕒𝕤𝕥&nbsp;&nbsp;𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕&nbsp;&nbsp;𝔾𝔻𝔽𝕝𝕚𝕩&nbsp;&nbsp;𝕃𝕚𝕟𝕜&nbsp;&nbsp;<i class="fa-solid fa-cloud-arrow-down"></i></p>
          <div class="btn-group text-center"> 
            ${UI.display_drive_link ? ` 
           <button class="btn btn-secondary d-flex align-items-center gap-2 gdflix-btn" 
          data-file-id="${file_id}" type="button">${gdrive_icon}𝗚𝗗𝗙𝗹𝗶𝘅 𝗟𝗶𝗻𝗸</button>` : ``} 
          <a href="${url}" type="button" class="btn btn-success">
          <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 
           </a>
            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" 
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only"></span>
            </button>
             <div class="dropdown-menu">
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Free)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.adm.lite/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Lite)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.plus/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM+ (Plus)</a>
						</div>
          </div>
        </div> 
      </div>`}
    </div>
  </div>`;
	$('#content').html(content);

	// Add GDFlix button click handler
  $(document).on('click', '.gdflix-btn', function() {
    const fileId = $(this).data('file-id');
    const button = $(this);
    
    console.log('Button clicked, fileId:', fileId); // Debug log
    
    if (!fileId) {
        alert('Error: No file ID found');
        return;
    }
    
    // Show loading state
    const originalHtml = button.html();
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin fa-fw"></i> Processing...');
    
    // Call the GDFlix function with proper error handling
    generateGDFlixLink(fileId)
        .then(() => {
            // Reset button on success
            button.prop('disabled', false).html(originalHtml);
        })
        .catch((error) => {
            // Reset button on error
            button.prop('disabled', false).html(originalHtml);
            console.error('GDFlix error:', error);
        });
    });
	
	// Rest of the function remains the same...
	$('#SearchModelLabel').html('<i class="fa-regular fa-eye fa-fw"></i>Preview');
	var preview = `<img class="w-100 rounded" src="${poster}" alt="Preview of ${name}" title="Preview of ${name}">`;
	var btn = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>`;
	$('#modal-body-space').html(preview);
	$('#modal-body-space-buttons').html(btn);
	if (poster && !mimeType.startsWith('application/vnd.google-apps')) {
		// Create a new image element
		var img = new Image();
		// Set up event handlers for image load and error
		$(img).on('load', function() {
			// Image loaded successfully
			$('#preview_spinner').hide(); // Hide the spinner
			$('#preview').css({'background': 'url("' + poster + '") 0 0 / 100% 100% no-repeat'});
			$('#preview').addClass('border-0');
			$('#overlay').css('opacity', '.9');
		}).on('error', function() {
			// Image failed to load
			$('#preview_spinner').hide(); // Hide the spinner
			// You might want to handle the error, for example, display a placeholder image or show an error message.
		});
		// Set the image source after setting up event handlers
		img.src = poster;
	}
}

// Also update the file_code function to include GDFlix button
// Replace the download section in file_code function with this:

function file_code(name, encoded_name, size, bytes, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';
	// Add the container and card elements
	var content = `
	<div class="card">
		<div class="card-header ${UI.file_view_alert_class}">
			<i class="fas fa-file-alt fa-fw"></i>File Information
		</div>
		<div class="card-body row g-3">
			<div class="col-lg-4 col-md-12">
				<div id="preview" class="h-100 border border-dark rounded d-flex justify-content-center align-items-center position-relative" style="--bs-border-opacity: .5;">
					<div id="code_spinner"></div>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css">
					<pre id="pre" class="rounded mb-0" style="height: 251px;"><code id="editor" class="h-100" style="white-space: pre-wrap; word-wrap: break-word;"></code></pre>
					${bytes >= 1024 * 1024 * 2 && poster ? `
					<div id="overlay" class="overlay border border-dark rounded d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5; opacity: 0;">
						<span><i class="fas fa-search-plus fa-2xl fa-fw"></i></span>
						<span>Preview</span>
						<a href="#" class="stretched-link" data-bs-toggle="modal" data-bs-target="#SearchModel" title="Thumbnail of ${name}"></a>
					</div>` : ``}
				</div>
			</div>
			<div class="col-lg-8 col-md-12" id="file-info">
				<table class="table table-dark">
					<tbody>
						<tr>
							<th>
								<i class="fa-regular fa-folder-closed fa-fw"></i>
								<span class="tth">Name</span>
							</th>
							<td>${name}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-regular fa-clock fa-fw"></i>
								<span class="tth">Datetime</span>
							</th>
							<td>${createdTime}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-tag fa-fw"></i>
								<span class="tth">Type</span>
							</th>
							<td>${formatMimeType(mimeType)}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-box-archive fa-fw"></i>
                 <span class="tth">Size</span>
                    </th>
                    <td>${size}</td>
                  </td>
						   </tr>
					 </tbody>
				 </table>
       ${UI.disable_video_download ? `` : `
      <div class="col-md-12">
        <div class="text-center">
          <p class="mb-2">🚀&nbsp;𝔽𝕒𝕤𝕥&nbsp;&nbsp;𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕&nbsp;&nbsp;𝔾𝔻𝔽𝕝𝕚𝕩&nbsp;&nbsp;𝕃𝕚𝕟𝕜&nbsp;&nbsp;<i class="fa-solid fa-cloud-arrow-down"></i></p>
          <div class="btn-group text-center"> 
            ${UI.display_drive_link ? ` 
           <button class="btn btn-secondary d-flex align-items-center gap-2 gdflix-btn" 
          data-file-id="${file_id}" type="button">${gdrive_icon}𝗚𝗗𝗙𝗹𝗶𝘅 𝗟𝗶𝗻𝗸</button>` : ``} 
          <a href="${url}" type="button" class="btn btn-success">
          <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 
           </a>
            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" 
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only"></span>
            </button>
            <div class="dropdown-menu">
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Free)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.adm.lite/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Lite)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.plus/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM+ (Plus)</a>
					 </div>
          </div>
        </div> 
      </div>`}
    </div>
  </div>`;
	$("#content").html(content);

	// Add GDFlix button click handler
  $(document).on('click', '.gdflix-btn', function() {
    const fileId = $(this).data('file-id');
    const button = $(this);
    
    console.log('Button clicked, fileId:', fileId); // Debug log
    
    if (!fileId) {
        alert('Error: No file ID found');
        return;
    }
    
    // Show loading state
    const originalHtml = button.html();
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin fa-fw"></i> Processing...');
    
    // Call the GDFlix function with proper error handling
    generateGDFlixLink(fileId)
        .then(() => {
            // Reset button on success
            button.prop('disabled', false).html(originalHtml);
        })
        .catch((error) => {
            // Reset button on error
            button.prop('disabled', false).html(originalHtml);
            console.error('GDFlix error:', error);
        });
    });
	
	// Rest of the function remains the same...
	$('#SearchModelLabel').html('<i class="fa-regular fa-eye fa-fw"></i>Preview');
	var preview = `<img class="w-100 rounded" src="${poster}" alt="Preview of ${name}" title="Preview of ${name}">`;
	var btn = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>`;
	$('#modal-body-space').html(preview);
	$('#modal-body-space-buttons').html(btn);
	var no_thumb = `<div class="d-flex align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5;"><span><i class="fa-solid fa-photo-film fa-2xl fa-fw"></i></span><span>Thumbnail not available</span></div>`;
	var spinner = '<div class="d-flex justify-content-center"><div class="spinner-border m-5" role="status"><span class="sr-only"></span></div></div>';
	$("#code_spinner").html(spinner);
	if (bytes <= 1024 * 1024 * 2) {
		$.get(url, function(data) {
			$('#editor').html($('<div/>').text(data).html());
			$("#code_spinner").html("");
			$('#pre').addClass("flex-fill");
			var height = document.querySelector("#file-info").offsetHeight;
			$('#pre').css('height', height-2 + 'px');
			hljs.highlightAll();
		});
	} else {
		$('#pre').hide();
		$('#editor').html(`File size is too large to preview, max. 2 MB`);
		if (poster) {
			// Create a new image element
			var img = new Image();
			// Set up event handlers for image load and error
			$(img).on('load', function() {
				// Image loaded successfully
				$('#code_spinner').hide(); // Hide the spinner
				$('#preview').css({'background': 'url("' + poster + '") 0 0 / 100% 100% no-repeat', 'min-height': '200px'});
				$('#preview').addClass('border-0');
				$('#overlay').css('opacity', '.9');
			}).on('error', function() {
				// Image failed to load
				$('#code_spinner').hide(); // Hide the spinner
				// You might want to handle the error, for example, display a placeholder image or show an error message.
			});
			// Set the image source after setting up event handlers
			img.src = poster;
		} else {
			$('#code_spinner').html(no_thumb);
		}
	}
}


  // Document display video  mkv|mp4|webm|avi| 
   function file_video(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	 // Define all player icons
    const vlc_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/vlc.png" alt="VLC Player" style="height: 32px; width: 32px; margin-right: 5px;">`;
    const mxplayer_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/Mxplayer-icon.png" alt="MX Player" style="height: 32px; width: 32px; margin-right: 5px;">`;
    const xplayer_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/xplayer-icon.png" alt="XPlayer" style="height: 32px; width: 32px; margin-right: 5px;">`;
    const playit_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/playit-icon.png" alt="Playit" style="height: 32px; width: 32px; margin-right: 5px;">`; 
    const new_download_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/download-icon.png" alt="Download" style="height: 32px; width: 32px; margin-right: 5px;">`;
		 var url_base64 = btoa(url);
	  const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';
	  let player
	  if (!UI.disable_player) {
		 if (player_config.player == "plyr") {
			player = `<video id="player" playsinline controls data-poster="${poster}">
      <source src="${url}" type="video/mp4" />
      <source src="${url}" type="video/webm" />
        </video>`
			player_js = 'https://cdn.plyr.io/' + player_config.plyr_io_version + '/plyr.polyfilled.js'
			player_css = 'https://cdn.plyr.io/' + player_config.plyr_io_version + '/plyr.css'
		} else if (player_config.player == "videojs") {
			player = `<video id="vplayer" poster="${poster}" class="video-js vjs-default-skin rounded" controls preload="none" width="100%" height="100%" data-setup='{"fill": true}' style="--plyr-captions-text-color: #ffffff;--plyr-captions-background: #000000; min-height: 200px;">
      <source src="${url}" type="video/mp4" />
      <source src="${url}" type="video/webm" />
      <source src="${url}" type="video/avi" />
    </video>`
			player_js = 'https://vjs.zencdn.net/' + player_config.videojs_version + '/video.js'
			player_css = 'https://vjs.zencdn.net/' + player_config.videojs_version + '/video-js.css'
		} else if (player_config.player == "dplayer") {
			player = `<div id="player-container"></div>`
			player_js = 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js'
			player_css = 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.css'
		} else if (player_config.player == "jwplayer") {
			player = `<div id="player"></div>`
			player_js = 'https://content.jwplatform.com/libraries/IDzF9Zmk.js'
			player_css = ''
		}
	}

 // Add the container and card elements
  var content = `
  <div class="card">
    <div class="card-header ${UI.file_view_alert_class}">
      <i class="fas fa-file-alt fa-fw"></i>File Information
    </div>
    <div class="card-body row g-3">
      <div class="col-lg-4 col-md-12">
        <div class="h-100 border border-dark rounded" style="--bs-border-opacity: .5;">
          ${player}
        </div>
      </div>
      <div class="col-lg-8 col-md-12">
        <table class="table table-dark">
          <tbody>
            <tr>
              <th>
                <i class="fa-regular fa-folder-closed fa-fw"></i>
                <span class="tth">Name</span>
              </th>
              <td>${name}</td>
            </tr>
            <tr>
              <th>
                <i class="fa-regular fa-clock fa-fw"></i>
                <span class="tth">Datetime</span>
              </th>
              <td>${createdTime}</td>
            </tr>
            <tr>
              <th>
                <i class="fa-solid fa-tag fa-fw"></i>
                <span class="tth">Type</span>
              </th>
              <td>${formatMimeType(mimeType)}</td>
            </tr>
            <tr>
              <th>
                <i class="fa-solid fa-box-archive fa-fw"></i>
                  <span class="tth">Size</span>
                    </th>
                    <td>${size}</td>
                    </td>
						     </tr>
					     </tbody>
				    </table>
        ${UI.disable_video_download ? `` : `
      <div class="col-md-12">
        <div class="text-center">
          <p class="mb-2">🚀&nbsp;𝔽𝕒𝕤𝕥&nbsp;&nbsp;𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕&nbsp;&nbsp;𝔾𝔻𝔽𝕝𝕚𝕩&nbsp;&nbsp;𝕃𝕚𝕟𝕜&nbsp;&nbsp;<i class="fa-solid fa-cloud-arrow-down"></i></p>
          <div class="btn-group text-center"> 
            ${UI.display_drive_link ? ` 
           <button class="btn btn-secondary d-flex align-items-center gap-2 gdflix-btn" 
          data-file-id="${file_id}" type="button">${gdrive_icon}𝗚𝗗𝗙𝗹𝗶𝘅 𝗟𝗶𝗻𝗸</button>` : ``} 
          <a href="${url}" type="button" class="btn btn-success">
          <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 
           </a>
            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" 
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only"></span>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="intent:${url}#Intent;package=com.playit.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${playit_icon} Playit</a>
              <a class="dropdown-item" href="intent:${url}#Intent;package=video.player.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${xplayer_icon} XPlayer</a>
              <a class="dropdown-item" href="intent:${url}#Intent;package=com.mxtech.videoplayer.ad;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${mxplayer_icon} MX Player</a>
              <a class="dropdown-item" href="intent:${url}#Intent;package=org.videolan.vlc;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${vlc_icon} VLC Player</a> 
             </div>
           </div> 
         </div>`}
       </div>
      </div>`; 
    $("#content").html(content);

// Add GDFlix button click handler
  $(document).on('click', '.gdflix-btn', function() {
    const fileId = $(this).data('file-id');
    const button = $(this);
    
    console.log('Button clicked, fileId:', fileId); // Debug log
    
    if (!fileId) {
        alert('Error: No file ID found');
        return;
    }
    
    // Show loading state
    const originalHtml = button.html();
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin fa-fw"></i> Processing...');
    
    // Call the GDFlix function with proper error handling
    generateGDFlixLink(fileId)
        .then(() => {
            // Reset button on success
            button.prop('disabled', false).html(originalHtml);
        })
        .catch((error) => {
            // Reset button on error
            button.prop('disabled', false).html(originalHtml);
            console.error('GDFlix error:', error);
        });
    });

  // Load Video.js and initialize the player
	var videoJsScript = document.createElement('script');
	videoJsScript.src = player_js;
	videoJsScript.onload = function() {
		// Video.js is loaded, initialize the player
		if (player_config.player == "plyr") {
			const player = new Plyr('#player');
		} else if (player_config.player == "videojs") {
			const player = new videojs('vplayer');
		} else if (player_config.player == "dplayer") {
			const dp = new DPlayer({
				container: document.getElementById('player-container'),
				screenshot: true,
				video: {
					url: url,
					pic: poster,
					thumbnails: poster,
				},
			});
		} else if (player_config.player == "jwplayer") {
			jwplayer("player").setup({
				file: url,
				type: mimeType,
				autostart: false,
				image: poster,
				width: "100%",
				aspectratio: "16:9",
				title: name,
				description: "Powered by Google Drive Index",
				tracks: [{
					file: url,
					kind: "captions",
					label: "Default",
					"default": true,
				}],
				captions: {
					color: "#f3f378",
					fontSize: 14,
					backgroundOpacity: 50,
					edgeStyle: "raised",
				},
			});
		}
	};
	document.head.appendChild(videoJsScript);

	var videoJsStylesheet = document.createElement('link');
	videoJsStylesheet.href = player_css;
	videoJsStylesheet.rel = 'stylesheet';
	document.head.appendChild(videoJsStylesheet);
}

// File display Audio |mp3|flac|m4a|wav|ogg|
function file_audio(name, encoded_name, size, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	var url_base64 = btoa(url);
	const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';

	// Add the container and card elements
	var player = `<video id="aplayer" poster="${UI.audioposter}" class="video-js vjs-default-skin rounded" controls preload="none" width="100%" height="100%" data-setup='{"fill": true}' style="--plyr-captions-text-color: #ffffff;--plyr-captions-background: #000000; object-fit: cover; min-height: 200px;">
					<source src="${url}" type="audio/mpeg" />
					<source src="${url}" type="audio/ogg" />
					<source src="${url}" type="audio/wav" />
				</video>`;

	const content = `
    <div class="card">
        <div class="card-header ${UI.file_view_alert_class}">
            ${copyFileBox}
            <i class="fas fa-file-alt fa-fw"></i>File Information
        </div>
        <div class="card-body row g-3">
            ${!UI.disable_player ? `
            <div class="col-lg-4 col-md-12">
                <div class="h-100 border border-dark rounded" style="--bs-border-opacity: .5;">
                    ${player}
                </div>
            </div>
            ` : ''}
            <div class="${UI.disable_player ? 'col-12' : 'col-lg-8 col-md-12'}">
                <table class="table table-dark">
                    <tbody>
                        <tr>
                            <th><i class="fa-regular fa-folder-closed fa-fw"></i><span class="tth">Name</span></th>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-regular fa-clock fa-fw"></i><span class="tth">Datetime</span></th>
                            <td>${createdTime}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-solid fa-tag fa-fw"></i><span class="tth">Type</span></th>
                            <td>${formatMimeType(mimeType)}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-solid fa-box-archive fa-fw"></i><span class="tth">Size</span></th>
                            <td>${size}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-solid fa-file-circle-check fa-fw"></i><span class="tth">Checksum</span></th>
                            <td>MD5: <code>${md5Checksum}</code></td>
                        </tr>
                    </tbody>
                </table>
                
                ${UI.disable_video_download ? '' : `
                <div class="col-md-12">
                    <div class="text-center">
                        <p class="mb-2">Download via</p>
                        <div class="btn-group text-center">
                            <a href="${url}" type="button" class="btn btn-success">
                                <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱
                            </a>
                            <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" 
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only"></span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=com.playit.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">Playit</a>
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=video.player.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">XPlayer</a>
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.ad;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">MX Player</a>
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=org.videolan.vlc;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">VLC Player</a>
                            </div>
                        </div>
                    </div>
                </div>
                `}
            </div>
        </div>
    </div>`;
    $("#content").html(content);

    // Initialize player if enabled
    if (!UI.disable_player && player_js) {
        const script = document.createElement('script');
        script.src = player_js;
        script.onload = () => {
        switch(player_config.player) {
        case "plyr":
        new Plyr('#player');
        break;
        case "videojs":
        videojs('vplayer', {fill: true});
        break;
        case "dplayer":
        new DPlayer({
        container: document.getElementById('player-container'),
        screenshot: true,
        video: {
        url: url,
        pic: poster,
        thumbnails: poster
                        }
                    });
                    break;
                    case "jwplayer":
                    jwplayer("player").setup({
                        file: url,
                        type: mimeTypeFixed,
                        autostart: false,
                        image: poster,
                        width: "100%",
                        aspectratio: "16:9",
                        title: name
                    });
                    break;
            }
        };
        document.head.appendChild(script);

        if (player_css) {
            const css = document.createElement('link');
            css.href = player_css;
            css.rel = 'stylesheet';
            document.head.appendChild(css);
        }
    }
}

// Time conversion
function utc2jakarta(utc_datetime) {
	// Convert UTC datetime to local Jakarta time
	var utcDate = new Date(utc_datetime);
	var jakartaOptions = { timeZone: 'Asia/Jakarta' };
	var jakartaDate = new Date(utcDate.toLocaleString('en-US', jakartaOptions));

	// Format the Jakarta date and time
	var year = jakartaDate.getFullYear();
	var month = ('0' + (jakartaDate.getMonth() + 1)).slice(-2);
	var date = ('0' + jakartaDate.getDate()).slice(-2);
	var hour = ('0' + jakartaDate.getHours()).slice(-2);
	var minute = ('0' + jakartaDate.getMinutes()).slice(-2);
	var second = ('0' + jakartaDate.getSeconds()).slice(-2);

	return `${date}-${month}-${year} ${hour}:${minute}`;
}

// MIME type formatting
function formatMimeType(mime) {
  if (!mime) return '';

  // Video type mapping
  const videoFormats = {
    'mp4': 'MP4',
    'x-matroska': 'MKV', 
    'quicktime': 'MOV',
    'avi': 'AVI',
    'mpeg': 'MPEG',
    'webm': 'WEBM',
    'ogg': 'OGG',
    'x-ms-wmv': 'WMV',
    'flv': 'FLV'
  };

  // Check if video type
  if (mime.startsWith('video/')) {
    const subtype = mime.split('/')[1];
    const format = videoFormats[subtype] || subtype.toUpperCase();
    return `${format} - ${mime}`;
  }

  return mime;
}

// bytes adaptive conversion to KB, MB, GB
function formatFileSize(bytes) {
	if (bytes >= 1099511627776) {
		bytes = (bytes / 1099511627776).toFixed(2) + ' TB';
	} else if (bytes >= 1073741824) {
		bytes = (bytes / 1073741824).toFixed(2) + ' GB';
	} else if (bytes >= 1048576) {
		bytes = (bytes / 1048576).toFixed(2) + ' MB';
	} else if (bytes >= 1024) {
		bytes = (bytes / 1024).toFixed(2) + ' KB';
	} else if (bytes > 1) {
		bytes = bytes + ' bytes';
	} else if (bytes === 1) {
		bytes = bytes + ' byte';
	} else {
		bytes = '';
	}
	return bytes;
}


String.prototype.trim = function(char) {
	if (char) {
		return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
	}
	return this.replace(/^\s+|\s+$/g, '');
};


// README.md HEAD.md support
function markdown(el, data) {
	var html = marked.parse(data);
	$(el).show().html(html);
}

// Listen for fallback events
window.onpopstate = function() {
	var path = window.location.pathname;
	render(path);
}

$(function() {
	init();
	var path = window.location.pathname;
	/*$("body").on("click", '.folder', function () {
	    var url = $(this).attr('href');
	    history.pushState(null, null, url);
	    render(url);
	    return false;
	});
	$("body").on("click", '.view', function () {
	    var url = $(this).attr('href');
	    history.pushState(null, null, url);
	    render(url);
	    return false;
	});*/

	render(path);
});

// Copy to Clipboard for Direct Links, This will be modified soon with other UI
function copyFunction() {
	var copyText = document.getElementById("dlurl");
	copyText.select();
	copyText.setSelectionRange(0, 99999);

	navigator.clipboard.writeText(copyText.value)
		.then(function() {
			var tooltip = document.getElementById("myTooltip");
			tooltip.innerHTML = `<i class="fas fa-check fa-fw"></i>Copied`;
		})
		.catch(function(error) {
			console.error("Failed to copy text: ", error);
		});
}

function outFunc() {
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = `<i class="fas fa-copy fa-fw"></i>Copy`;
}

// function to update the list of checkboxes
function updateCheckboxes() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	const selectAllCheckbox = document.getElementById('select-all-checkboxes');

	if (checkboxes.length > 0 && selectAllCheckbox) { // Check if checkboxes and selectAllCheckbox exist
		selectAllCheckbox.addEventListener('click', () => {
			checkboxes.forEach((checkbox) => {
				checkbox.checked = selectAllCheckbox.checked;
			});
		});
	}
}

async function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// Copy File to User Drive
async function copyFile(driveid) {
	try {
		const copystatus = document.getElementById('copystatus');
		copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Processing... </div>`;

		const user_folder_id = document.getElementById('user_folder_id').value;
		if (user_folder_id === '') {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Empty ID </div>`;
			return null;
		}

		document.getElementById('spinner').style.display = 'block';
		document.cookie = `root_id=${user_folder_id}; expires=Thu, 18 Dec 2050 12:00:00 UTC`;
		const time = Math.floor(Date.now() / 1000);
		const response = await fetch('/copy', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `id=${encodeURIComponent(driveid)}&root_id=${user_folder_id}&resourcekey=null&time=${time}`
		});

		if (response.status === 500) {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unable to Copy File, Make Sure you've added system@zindex.eu.org to your Destination Folder </div>`;
		} else if (response.status === 401) {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unauthorized </div>`;
		} else if (response.ok) {
			const data = await response.json();
			if (data && data.name) {
				const link = `https://drive.google.com/file/d/${data.id}/view?usp=share_link`;
				const copyresult = document.getElementById('copyresult');
				copyresult.innerHTML = `<div class="col-12 col-md-12"> <input type="text" id="usercopiedfile" class="form-control" placeholder="Enter Your Folder ID to Copy this File" value="${link}" readonly></div> <div class="col-12 col-md-12"> <a href="${link}" target="_blank" style="margin-top: 5px;" class="btn btn-danger btn-block">Open Copied File</a></div>`;
			} else if (data && data.error && data.error.message) {
				copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> ` + data.error.message + ` </div>`;
			} else {
				copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unable to Copy File </div>`;
			}
		} else {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unable to Copy File </div>`;
		}

		document.getElementById('spinner').style.display = 'none';
	} catch (error) {
		const copystatus = document.getElementById('copystatus');
		copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> An error occurred ` + error + `</div>`;
		document.getElementById('spinner').style.display = 'none';
	}
}

// Update the generateGDFlixLink function to call the worker endpoint
function generateGDFlixLink(fileId) {
    return new Promise((resolve, reject) => {
        // Debug logging
        console.log('GDFlix - Received fileId:', fileId);
        
        // Basic validation
        if (!fileId) {
            console.error('GDFlix - No file ID provided');
            reject(new Error('No file ID provided'));
            return;
        }
        
        // Convert to string if it's not already
        fileId = String(fileId).trim();
        
        if (fileId === '') {
            console.error('GDFlix - Empty file ID');
            reject(new Error('Empty file ID'));
            return;
        }
        
        console.log('GDFlix - Requesting link generation from worker...');
        
        // Make request to worker endpoint
        fetch('/generate-gdflix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_id: fileId
            })
        })
        .then(response => {
            console.log('GDFlix - Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('GDFlix - Worker response:', data);
            
            if (data.success && data.gdflix_link) {
                console.log('GDFlix - Generated link:', data.gdflix_link);
                // Open the GDFlix link directly in a new tab
                window.open(data.gdflix_link, '_blank');
                resolve(data.gdflix_link);
            } else {
                reject(new Error(data.error || 'Failed to generate GDFlix link'));
            }
        })
        .catch(error => {
            console.error('GDFlix Error:', error);
            alert('Failed to generate GDFlix link: ' + error.message);
            reject(error);
        });
    });
}

// create a MutationObserver to listen for changes to the DOM
const observer = new MutationObserver(() => {
	updateCheckboxes();
});

// define the options for the observer (listen for changes to child elements)
const options = {
	childList: true,
	subtree: true
};

// observe changes to the body element
observer.observe(document.documentElement, options);
