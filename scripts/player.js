class CustomElement extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        // Create the HTML structure for the custom element
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="audio-player">
                <div class="audio-player__image">
                    <img class="audio-icon" src="./img/logo.svg" inline />
                </div>
                <div class="audio-player__controls">
                    <audio id="myAudio" src={{site.audioSrc}}></audio>
                    <div class="controls">
                        <button class="player-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--clr-primary)">
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <input type="range" class="timeline" max="100" value="0"/>
                        <div class="volume-control">
                            <div class="speaker-icon toggle-icon"></div>
                            <div class="bars">
                                <span class="bar"></span>
                                <span class="bar"></span>
                                <span class="bar"></span>
                                <span class="bar"></span>
                                <span class="bar"></span>
                                <input class="volume-input" type="range" min="0" max="100" step="20" value="20"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const playerButton = this.shadowRoot.querySelector('.player-button');
        const audio = this.shadowRoot.querySelector('audio');
        const timeline = this.shadowRoot.querySelector('.timeline');
        const volumeInput = this.shadowRoot.querySelector('.volume-input');
        const volumeControl = this.shadowRoot.querySelector('.volume-control');
        const toggleIcon = this.shadowRoot.querySelector('.toggle-icon');

        const playIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--clr-primary)">
                <!-- Play icon path -->
            </svg>
        `;

        const pauseIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--clr-primary)">
                <!-- Pause icon path -->
            </svg>
        `;

        const soundIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--player-button-color)">
                <!-- Sound icon path -->
            </svg>
        `;

        const muteIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--player-button-color)">
                <!-- Mute icon path -->
            </svg>
        `;

        function toggleAudio() {
            if (audio.paused) {
                audio.play();
                playerButton.innerHTML = pauseIcon;
            } else {
                audio.pause();
                playerButton.innerHTML = playIcon;
            }
        }

        playerButton.addEventListener('click', toggleAudio);

        function changeTimelinePosition() {
            const percentagePosition = (100 * audio.currentTime) / audio.duration;
            timeline.style.backgroundSize = `${percentagePosition}% 100%`;
            timeline.value = percentagePosition.toString();
        }

        audio.addEventListener('timeupdate', changeTimelinePosition);

        function audioEnded() {
            playerButton.innerHTML = playIcon;
        }

        audio.addEventListener('ended', audioEnded);

        function changeSeek() {
            const time = (parseFloat(timeline.value) * audio.duration) / 100;
            audio.currentTime = time;
        }

        timeline.addEventListener('input', changeSeek);

        function setVolume() {
            var volume = parseInt(volumeInput.value);
            volumeControl.className = "volume-control";

            if (volume > 0) {
                volumeControl.classList.add("volume-on");
                volumeControl.classList.add("volume-" + volume);
                toggleIcon.innerHTML = soundIcon;
            } else {
                volumeControl.classList.remove("volume-on");
                toggleIcon.innerHTML = muteIcon;
            }

            audio.volume = volume / 100;
        }

        volumeInput.addEventListener("input", setVolume);
        setVolume();
    }
}

customElements.define('custom-element', CustomElement);