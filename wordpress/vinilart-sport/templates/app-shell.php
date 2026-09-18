<?php
/**
 * Template Name: VinilArt Sport App Shell
 * Description: Shell dedicada para renderização de página completa da aplicação React.
 *
 * @package VinilArt_Sport
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="root" class="vinilart-sport-app-container">
	<noscript>
		<div style="padding: 40px; text-align: center; color: #fff; background: #0B0C10;">
			<h1>VinilArt Sport</h1>
			<p>Para aceder à experiência completa de personalização e loja, por favor ativa o JavaScript.</p>
		</div>
	</noscript>
</main>

<?php
get_footer();
