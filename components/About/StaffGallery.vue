<template>
  <Observer
    :onEnter="(node) => onEnter(node, index)"
    :onLeave="(node) => onExit(node, index)"
    class="staff-gallery"
    once
  >
    <Grid>
      <Column span="12" span-tablet="4" v-for="person in staff" ref="col">
        <AboutStaffBio
          :name="person.name"
          :role="person.role"
          :bio="person.bio"
          :images="person.images"
        />
      </Column>
    </Grid>
  </Observer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const col = ref(null);
const colAll = ref(null);

const props = defineProps({
  staff: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  if (col.value && col.value.length) {
    colAll.value = col.value.map((column) => column.$el);
  } else {
    console.log("No columns found");
  }
});

const onEnter = (node, index) => {
  // Use GSAP timeline for staggered animation
  gsap.timeline().fromTo(
    colAll.value,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      // y: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.125,
      delay: 0.2,
    }
  );
};

const onExit = (node) => {
  gsap.set(colAll.value, {
    opacity: 0,
    // y: 50,
  });
};
</script>

<style lang="scss" scoped>
.staff-gallery {
  margin-top: var(--bigger);
  margin-bottom: var(--bigger);

  @include tablet {
    margin-top: var(--biggest);
    margin-bottom: var(--biggest);
  }

  @include laptop {
    margin-top: var(--huge);
    margin-bottom: var(--big);
  }
}
</style>
