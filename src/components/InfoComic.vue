<template>
  Usar para la info del comic con modal 
</template>

<script>
import { mapState } from 'vuex'

export default {
    name:'InfoComic',
    computed: {
        ...mapState(["infoComics"]),
    },
}
</script>

<style lang="scss" scoped>

</style>