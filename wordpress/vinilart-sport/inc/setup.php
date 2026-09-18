<?php
/**
 * Configuração e inicialização das funcionalidades base do tema.
 *
 * @package VinilArt_Sport
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'vinilart_sport_setup' ) ) {
	/**
	 * Configura os suportes do tema e regista funcionalidades do WordPress.
	 */
	function vinilart_sport_setup() {
		// Internacionalização
		load_theme_textdomain( 'vinilart-sport', VINILART_SPORT_DIR . '/languages' );

		// Gestão automática do título da página
		add_theme_support( 'title-tag' );

		// Suporte para imagens destacadas (Post Thumbnails)
		add_theme_support( 'post-thumbnails' );

		// Suporte para marcação HTML5
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Suporte para logotipo personalizado
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 80,
				'width'       => 240,
				'flex-height' => true,
				'flex-width'  => true,
			)
		);

		// Suporte para alinhamentos amplos do editor
		add_theme_support( 'align-wide' );

		// Suporte para incorporações responsivas
		add_theme_support( 'responsive-embeds' );

		// Registo de localizações de menus
		register_nav_menus(
			array(
				'primary' => __( 'Menu Principal', 'vinilart-sport' ),
				'footer'  => __( 'Menu de Rodapé', 'vinilart-sport' ),
			)
		);
	}
}
add_action( 'after_setup_theme', 'vinilart_sport_setup' );

if ( ! function_exists( 'vinilart_sport_content_width' ) ) {
	/**
	 * Define a largura máxima de conteúdo para embeds e imagens.
	 */
	function vinilart_sport_content_width() {
		$GLOBALS['content_width'] = apply_filters( 'vinilart_sport_content_width', 1400 );
	}
}
add_action( 'after_setup_theme', 'vinilart_sport_content_width', 0 );
