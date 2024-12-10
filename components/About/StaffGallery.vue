<template>
  <Grid class="staff-gallery">
    <Column span="12" span-tablet="4" v-for="person in staff">
      <AboutStaffBio
        :name="person.name"
        :role="person.role"
        :bio="person.bio"
        :images="person.images"
      />
    </Column>
  </Grid>
</template>

<script setup>
const props = defineProps({
  staff: {
    type: Array,
    required: true,
  },
});
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
    margin-top: var(--hugest);
    margin-bottom: var(--hugest);
  }
}
</style>
