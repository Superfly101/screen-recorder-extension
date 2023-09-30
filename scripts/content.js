
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
  const stopBtn = document.querySelector("#superfly-ad3dfq-stop");
  const cameraBtn = document.querySelector("#superfly-ad3dfq-camera");
  const micBtn = document.querySelector("#superfly-ad3dfq-mic");
  // const deleteBtn = document.querySelector("#superfly-ad3dfq-delete");
  let downloadButton = document.querySelector("#superfly-ad3dfq-delete");

  let totalSeconds = 0;
  const time = document.querySelector("#superfly-ad3dfq-time")

  const startRecording = async () => {
    // const mediaDevices = navigator.mediaDevices;

    // stream = await mediaDevices.getDisplayMedia({
    //   video: true,
    // })

    // audio = await mediaDevices.getUserMedia({
    //   audio: {
    //     echoCancellation: true,
    //     noiseSuppression: true,
    //     sampleRate: 44100
    //   }
    // });

    await setupStream();

    // setupVideoFeedback();

    // recorder = new RecordRTCPromisesHandler(stream, {
    //   type: 'video',
    //   disableLogs: true
    // });

    if (stream && audio) {
      mixedStream = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks()
      ]);

      recorder = new MediaRecorder(mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);

      console.log("Recording has started...")
      setInterval(() => {
        ++totalSeconds;
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        const minutes = String(parseInt(totalSeconds / 60)).padStart(2, "0");
        const hours = "00"
        time.textContent = `${hours}:${minutes}:${seconds}`
      }, 1000)
    } else {
      console.log("No stream available")
    }
  }

  startRecording();



  const handlePause = () => {
    console.log("Recording pause")
  }

  // const handleStop = async () => {
  //   if (recorder) {
  //     console.log("Stop recording")
  //     await recorder.stopRecording();
  //     await mediaStream.stop();
  //     let blob = await recorder.getBlob();
  //     invokeSaveAsDialog(blob, "web.webm");
  //   }
  // }
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
      // const video = document.querySelector(".video-feedbakc");
      // video.srcObject = stream;
      // video.play();
    } else {
      console.warn("No stream available")
    }
  }

  function handleDataAvailable(event) {
    chunks.push(event.data);
  }

  function stopRecording() {
    recorder.stop();
    console.log("Recording has stopped...")
  };

  function handleStop(e) {
    const blob = new Blob(chunks, {
      type: 'video/mp4'
    })

    chunks = [];

    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = 'video.mp4'

    // recordedVideo.src = URL.createObjectURL(blob);
    // recordedVideo.load();
    // recordedVideo.onloadeddata = () => {
    //   recordedVideo.play();

    //   // const rc = document.querySelector(".recorded-video-wrap");
    //   // rc.classList.remove("hidden");
    //   // rc.scrollIntoView({ "behavior": "smooth", "block": 'start' })
    // }

    stream.getTracks().forEach(track => track.stop());
    audio.getTracks().forEach(track => track.stop());

    console.log("Recording has been prepared...")
  }




  pauseBtn.addEventListener('click', handlePause)
  stopBtn.addEventListener('click', stopRecording)
  // cameraBtn.addEventListener('click', handleCamera)
  micBtn.addEventListener('click', handleMic)
  // deleteBtn.addEventListener('click', handleDelete)
}