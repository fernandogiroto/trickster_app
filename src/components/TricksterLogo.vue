<template>
	<video autoplay muted playsinline loop>
      <source src="@/assets/videos/trickster.mov" type="video/mp4">
    </video>
    <AnimatedText :title="title"/>
</template>
  
<script setup>

	import AnimatedText from '@/components/AnimatedText.vue';
	const props = defineProps({
		title:{ default:'O IMPOSTOR',type:String},
		width:{ default:'100%',type:String},
		height:{ default:'100%',type:String}

	})

</script>
  
<style lang="scss" scoped>

	@import '@/scss/animations';

	video {
		top: 0; 
		left: 0; 
		width: v-bind(width); 
		height: v-bind(height); 
		object-fit: contain; 
		border: 5px solid #FFF;
	}

</style>