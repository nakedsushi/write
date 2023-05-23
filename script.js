import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

export default {
    setup() {
        // tracks mouse position
        const { x, y } = useMouse()

        // is user prefers dark theme
        const isDark = usePreferredDark()

        // persist state in localStorage
        const store = useLocalStorage(
            'my-storage',
            {
                name: 'Apple',
                color: 'red',
            },
        )

        return { x, y, isDark, store }
    },
}


const app = createApp({
    data() {
        return {
            timeIndex: 0,
            possibleTimes: [ 15 * 60, 20 * 60, 30 * 60, 5 * 60],
            idleLimitSeconds: 5, //default = 5 seconds
            timeLimit: 900, //default = 15 mins, 900 seconds
            timePassed: 0,
            timerInterval: null,
            goodJobMode: false,
            writeMode: false,
            showInput: false,
            text: null,
            copied: false,
            animateLeave: true
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
            if (diff <= 0) { // Timer has run down
                this.goodJobMode = true;
            }
            return diff;
        }
    },
    methods: {
        tickTock() {
            if (this.goodJobMode) {
                return;
            }

            this.idleTime += 1;
            this.timePassed += 1;

            if (this.idleTime >= this.idleLimitSeconds && this.idleTime < this.maxIdleTime) {
                this.showInput = false;
            } else if (this.idleTime > this.maxIdleTime) {
                this.idleTime = 0;
                this.resetAll();
            }
        },
        startCounters() {
            this.maxIdleTime = this.idleLimitSeconds + 5;
            this.timerInterval = setInterval(this.tickTock, 1000);
        },
        activateWriteMode() {
            this.timePassed = 0;
            this.writeMode = true;
            this.showInput = true;
            this.idleTime = 0;
            this.startCounters();
            this.$nextTick(() => {
                this.$refs.input.focus();
            })

        },
        copyToClipboard() {
            navigator.clipboard.writeText(this.text);
            this.copied = true;
            clearInterval(this.timerInterval);
        },
        cycleTime() {
            this.timeIndex++;
            const index = this.timeIndex % this.possibleTimes.length;
            this.timeLimit = this.possibleTimes[index]
        },
        resetIdle() {
            if (!this.animateLeave) {
                this.animateLeave = true;
            }
            this.showInput = true;
            this.idleTime = 0;
        },
        resetAll() {
            clearInterval(this.timerInterval);
            if (this.goodJobMode) {
                return;
            }

            this.writeMode = false;
            this.text = null;
            this.showInput = false;
            this.copied = false;
        },
        triggerReset() {
            this.goodJobMode = false;
            this.animateLeave = false;
            this.resetAll();
        }
    }
})

app.mount('#container')
