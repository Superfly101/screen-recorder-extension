
if (!document.querySelector("#superfly-very-unique-id")) {

  document.body.classList.add('relative')
  document.body.innerHTML += `
    <section id="superfly-very-unique-id" class="w-full max-w-[35rem] z-[999] sticky bottom-8 left-8">
    <div
      class="px-8 py-4 rounded-full border-4 border-[#6262622B] bg-[#141414] flex items-center max-h-[10rem] m-0"
    >
      <div class="p-0 pr-6 flex gap-4 items-center border-r border-[#E8E8E8] bg-transparent m-0 w-fit">
        <p class="text-white text-xl" id="superfly-ad3dfq-time">00:00:00</p>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="20"
            height="20"
            rx="10"
            fill="#C00404"
            fill-opacity="0.19"
          />
          <rect x="5" y="5" width="10" height="10" rx="5" fill="#C00404" />
        </svg>
      </div>
      <div class="p-0 pl-6 flex justify-between items-start w-full bg-transparent m-0">
        <button id="superfly-ad3dfq-pause">
          <img src="${chrome.runtime.getURL('assets/pause.png')}" alt="pause icon" class="w-full" />
        </button>
        <button id="superfly-ad3dfq-play" class="bg-white p-2.5 rounded-full items-center justify-center hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 512 512"><path d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>
        </button>
        <button id="superfly-ad3dfq-stop">
          <img src="${chrome.runtime.getURL("assets/stop.png")}" alt="stop icon" class="w-full" />
        </button>
        <button id="superfly-ad3dfq-camera">
          <img src="${chrome.runtime.getURL("assets/camera.png")}" alt="camera icon" class="w-full" />
        </button>
        <button id="superfly-ad3dfq-mic">
          <img src="${chrome.runtime.getURL("assets/mic.png")}" alt="mic icon" class="w-full" />
        </button>
        <a
        id="superfly-ad3dfq-delete"
          class="flex items-center p-3 rounded-full bg-[#4B4B4B] hover:bg-red-500"
        >
          <img src="${chrome.runtime.getURL("assets/trash-icon.png")}" alt="trash icon" />
        </a>
      </div>
    </div>
  </section>


    `

  let mediaStream = "";
  let stream = null,
    audio = null,
    mixedStream = null,
    chunks = [],
    recorder = null
  startButton = null,
    stopButton = null,
    recordedVideo = null;



  const pauseBtn = document.querySelector("#superfly-ad3dfq-pause");
  const playBtn = document.querySelector("#superfly-ad3dfq-play");

  const stopBtn = document.querySelector("#superfly-ad3dfq-stop");
  const cameraBtn = document.querySelector("#superfly-ad3dfq-camera");
  const micBtn = document.querySelector("#superfly-ad3dfq-mic");
  let downloadButton = document.querySelector("#superfly-ad3dfq-delete");

  let totalSeconds = 0;
  const time = document.querySelector("#superfly-ad3dfq-time")

  const startRecording = async () => {

    await setupStream();

    if (stream && audio) {
      mixedStream = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks()
      ]);

      recorder = new MediaRecorder(mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);


      setInterval(() => {
        if (recorder.state === "recording") {
          ++totalSeconds;
          const seconds = String(totalSeconds % 60).padStart(2, "0");
          const minutes = String(parseInt(totalSeconds / 60)).padStart(2, "0");
          const hours = "00"
          time.textContent = `${hours}:${minutes}:${seconds}`
        }
      }, 1000)
    } else {
      console.log("No stream available")
    }
  }

  startRecording();



  const handlePause = () => {
    recorder.pause();
    pauseBtn.classList.toggle("hidden");
    playBtn.classList.toggle("hidden");

  }

  const handlePlay = () => {
    recorder.resume();
    pauseBtn.classList.toggle("hidden");
    playBtn.classList.toggle("hidden");

  }

  const handleCamera = () => {
    console.log("Turn on Camera")
  }
  const handleMic = () => {
    console.log("Turn on mic")
  }

  const handleDelete = () => {
    console.log("Delete recording");
  }

  async function setupStream() {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setupVideoFeedback();
    } catch (err) {
      console.log(err)
    }
  }

  function setupVideoFeedback() {
    if (stream) {
    } else {
      console.warn("No stream available")
    }
  }

  function handleDataAvailable(event) {
    chunks.push(event.data);
  }

  async function stopRecording() {
    recorder.stop();
  };

  function handleStop(e) {
    const blob = new Blob(chunks, {
      type: 'video/mp4'
    })

    chunks = [];

    stream.getTracks().forEach(track => track.stop());
    audio.getTracks().forEach(track => track.stop());

    invokeSaveAsDialog(blob, "new-recording.mp4");

  }




  pauseBtn.addEventListener('click', handlePause)
  playBtn.addEventListener('click', handlePlay)
  stopBtn.addEventListener('click', stopRecording)
  micBtn.addEventListener('click', handleMic)
}