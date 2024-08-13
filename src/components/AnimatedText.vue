<template>
	<span class="animated-text">{{ title }}</span>
</template>
  
<script setup>

	const props = defineProps({
		title:String
	})

</script>
  
<style lang="scss" scoped>

	@import '@/scss/animations';

	.animated-text {
		font: 50px "Oswald", sans-serif;
		letter-spacing: 0;
		padding: .25em 0 .325em;
		display: block;
		margin: 0 auto;
		text-shadow: 0 0 80px rgba(255,255,255,.5);
		background: url('../assets/img/bar.png') repeat-y;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		-webkit-animation: aitf 80s linear infinite;
		-webkit-transform: translate3d(0,0,0);
		-webkit-backface-visibility: hidden;
	}

</style>