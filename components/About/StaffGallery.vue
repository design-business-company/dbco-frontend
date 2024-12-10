<template>
  <Grid>
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

<style lang="scss" scoped></style>
