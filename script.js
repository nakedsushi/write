import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const app = createApp({
    data() {
        return {
            timeLimit: 900,
            timePassed: 0,
            timerInterval: null,
            writeMode: false
        }
    },
    computed: {
        prettyTimeLeft() {
            const timeLeft = this.timeLeft
            const minutes = Math.floor(timeLeft / 60)
            let seconds = timeLeft % 60
            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${minutes}:${seconds}`
        },
        timeLeft() {
            const diff = this.timeLimit - this.timePassed
            if (diff <= 0) {
                this.writeMode = false;
            }
            return diff;
        }
    },
    methods: {
        startCounter() {
          this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
        },
        activateWriteMode() {
            this.timePassed = 0;
            this.writeMode = true;
            this.startCounter();
        }
    }
})

app.mount('#container')
