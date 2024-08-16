<template>
	<video autoplay muted playsinline loop ref="videoPlayer"> 
		<slot name="video"></slot>
    </video>
    <AnimatedText :title="title" v-if="animatedTitle"/>
</template>
  
<script setup>

import { ref } from 'vue';
	import AnimatedText from '@/components/AnimatedText.vue';
	const props = defineProps({
		video:{ default:'trickster.mov',type:String},
		type:{ default:'video/mp4',type:String},
		title:{ default:'O IMPOSTOR',type:String},
		width:{ default:'100%',type:String},
		height:{ default:'100%',type:String},
		animatedTitle:{default:true,type:Boolean},
		border:{ default:'5px solid #FFF',type:String},
	})

	const videoPlayer = ref(null);

</script>
  
<style lang="scss" scoped>

	@import '@/scss/animations';

	video {
		top: 0; 
		left: 0; 
		width: v-bind(width); 
		height: v-bind(height); 
		object-fit: contain; 
		border: v-bind(border);
	}

</style>