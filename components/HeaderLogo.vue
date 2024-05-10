<template>
  <div id="app">
    <h1>
      <Text size="headline-2" @mouseover="shuffle(line[0])">{{
        line[0].val
      }}</Text>
      <Text size="headline-2" @mouseover="shuffle(line[1])">{{
        line[1].val
      }}</Text>
      <Text size="headline-2" @mouseover="shuffle(line[2])">{{
        line[2].val
      }}</Text>
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shuffleDuration: 100,
      resetDuration: 3000,
      line: [
        {
          name: "Design",
          val: "Design",
          animating: false,
          resetTimer: null,
          options: [
            "Damn Good",
            "Democratic",
            "Dazzling",
            "Delightful",
            "Dynamic",
            "Dreamy",
            "Daring",
            "Decorative",
            "Dramatic",
            "Danceable",
            "Distinct",
            "Divine",
            "Decadent",
            "Desirable",
            "Dainty",
            "Delicate",
            "Detailed",
            "Distinguished",
            "Dazzle",
            "Doodle",
            "Da Vinci",
            "Devotion",
          ],
        },
        {
          name: "Business",
          val: "Business",
          animating: false,
          resetTimer: null,
          options: [
            "Beautiful",
            "Brilliant",
            "Bold",
            "Breathtaking",
            "Business-savvy",
            "Balanced",
            "Business-minded",
            "Beauteous",
            "Bespoke",
            "Blissful",
            "Breakthrough",
            "Benevolent",
            "Businesslike",
          ],
        },
        {
          name: "Company",
          val: "Company",
          animating: false,
          resetTimer: null,
          options: [
            "Collective",
            "Conglomerate",
            "Characters",
            "Conspiracy",
            "Cult",
            "Community",
            "Cohort",
            "Citizens",
            "Coalition",
            "Crew",
            "Clan",
            "Collaborators",
            "Camaraderie",
            "Comrades",
            "Congregation",
            "Chorus",
            "Coterie",
            "Clique",
            "Companions",
            "Council",
            "Convoy",
            "Comradeship",
            "Cell",
            "Co-op",
            "Chamber",
          ],
        },
      ],
    };
  },
  mounted() {
    this.shuffleArray(this.line[0].options);
  },
  methods: {
    reset() {
      this.line.forEach((line) => (line.val = line.name));
    },
    shuffleAll() {
      this.line.forEach((line) => this.shuffle(line));
    },
    scrambleString(str) {
      str
        .split("")
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join("");
    },
    shuffleArray(arr) {
      for (let i = arr.length; i > 1; i--) {
        let r = Math.floor(Math.random() * i);
        let temp = arr[r];
        arr[r] = arr[i - 1];
        arr[i - 1] = temp;
      }
    },
    shuffle(obj) {
      if (obj.animating) return;

      // Clear any existing timeout to reset the text
      clearTimeout(obj.resetTimer);

      let timesRun = 0;
      const interval = setInterval(() => {
        obj.animating = true;
        timesRun += 1;

        this.shuffleArray(obj.options);
        obj.val = obj.options[0];

        if (timesRun === 8) {
          clearInterval(interval);
          obj.animating = false;

          // Set a timeout to reset the text to its original value after 5 seconds
          obj.resetTimer = setTimeout(() => {
            obj.val = obj.name;
          }, this.resetDuration);
        }
      }, this.shuffleDuration);
    },
  },
};
</script>
