<?php
/**
 * Gestão e enfileiramento de assets (CSS e JavaScript) do tema.
 *
 * Suporta resolução automática de hashes do Vite através de manifest
 * ou auto-descoberta dinâmica por glob sem hardcoding.
 *
 * @package VinilArt_Sport
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'vinilart_sport_get_asset_manifest' ) ) {
	/**
	 * Obtém a estrutura de ficheiros compilados a partir do manifest ou de glob dinâmico.
	 *
	 * @return array Array associativo com caminhos para ficheiros de entrada (entry_js, entry_css).
	 */
	function vinilart_sport_get_asset_manifest() {
		static $cached_manifest = null;

		if ( null !== $cached_manifest ) {
			return $cached_manifest;
		}

		$theme_dir = VINILART_SPORT_DIR;
		$manifest_data = array(
			'entry_js'  => '',
			'entry_css' => '',
		);

		// 1. Tentar ler o ficheiro assets-manifest.json gerado pelo build/sync
		$manifest_file = $theme_dir . '/assets/assets-manifest.json';
		if ( file_exists( $manifest_file ) ) {
			$raw_content = file_get_contents( $manifest_file );
			if ( false !== $raw_content ) {
				$parsed = json_decode( $raw_content, true );
				if ( is_array( $parsed ) ) {
					if ( ! empty( $parsed['entry'] ) ) {
						$manifest_data['entry_js'] = $parsed['entry'];
					}
					if ( ! empty( $parsed['css'] ) ) {
						$manifest_data['entry_css'] = $parsed['css'];
					}
				}
			}
		}

		// 2. Se não encontrou no manifest, efetuar auto-descoberta dinâmica por padrão glob (sem hardcode)
		if ( empty( $manifest_data['entry_js'] ) ) {
			$js_search_paths = array(
				$theme_dir . '/assets/build/index-*.js',
				$theme_dir . '/assets/js/index-*.js',
				$theme_dir . '/assets/index-*.js',
				$theme_dir . '/assets/index.js',
			);

			foreach ( $js_search_paths as $pattern ) {
				$matches = glob( $pattern );
				if ( ! empty( $matches ) ) {
					$matched_path = str_replace( $theme_dir . '/', '', $matches[0] );
					$manifest_data['entry_js'] = str_replace( '\\', '/', $matched_path );
					break;
				}
			}
		}

		if ( empty( $manifest_data['entry_css'] ) ) {
			$css_search_paths = array(
				$theme_dir . '/assets/build/styles-*.css',
				$theme_dir . '/assets/css/styles-*.css',
				$theme_dir . '/assets/styles-*.css',
				$theme_dir . '/assets/styles.css',
			);

			foreach ( $css_search_paths as $pattern ) {
				$matches = glob( $pattern );
				if ( ! empty( $matches ) ) {
					$matched_path = str_replace( $theme_dir . '/', '', $matches[0] );
					$manifest_data['entry_css'] = str_replace( '\\', '/', $matched_path );
					break;
				}
			}
		}

		$cached_manifest = $manifest_data;
		return $manifest_data;
	}
}

if ( ! function_exists( 'vinilart_sport_enqueue_scripts' ) ) {
	/**
	 * Enfileira os estilos e scripts do frontend do VinilArt Sport.
	 *
	 * As fontes Google já são geridas nativamente pelo frontend compilado,
	 * evitando duplicação de pedidos.
	 */
	function vinilart_sport_enqueue_scripts() {
		$theme_uri = VINILART_SPORT_URI;
		$version   = VINILART_SPORT_VERSION;

		// 1. Estilo base do tema WordPress
		wp_enqueue_style(
			'vinilart-sport-theme-style',
			get_stylesheet_uri(),
			array(),
			$version
		);

		// 2. Obter manifest de assets compilados
		$manifest = vinilart_sport_get_asset_manifest();

		// 3. CSS Compilado do Frontend
		if ( ! empty( $manifest['entry_css'] ) ) {
			wp_enqueue_style(
				'vinilart-sport-app-style',
				$theme_uri . '/' . ltrim( $manifest['entry_css'], '/' ),
				array( 'vinilart-sport-theme-style' ),
				$version
			);
		}

		// 4. JavaScript Principal do Frontend (Módulo ES)
		if ( ! empty( $manifest['entry_js'] ) ) {
			wp_enqueue_script(
				'vinilart-sport-app',
				$theme_uri . '/' . ltrim( $manifest['entry_js'], '/' ),
				array(),
				$version,
				true
			);

			// Configuração global para o frontend
			$frontend_config = array(
				'siteUrl'     => esc_url( home_url( '/' ) ),
				'themeUri'    => esc_url( $theme_uri ),
				'assetsUri'   => esc_url( $theme_uri . '/assets' ),
				'apiUrl'      => esc_url( rest_url( 'vinilart-sport/v1' ) ),
				'restNonce'   => wp_create_nonce( 'wp_rest' ),
				'siteTitle'   => get_bloginfo( 'name' ),
				'currency'    => 'EUR',
				'routes'      => array(
					'home'          => '/',
					'loja'          => '/loja',
					'personalizar'  => '/personalizar',
					'portfolio'     => '/portfolio',
					'contactos'     => '/contactos',
					'carrinho'      => '/carrinho',
					'checkout'      => '/checkout',
					'adeptos'       => '/adeptos',
					'equipamentos'  => '/equipamentos',
				),
			);

			wp_add_inline_script(
				'vinilart-sport-app',
				'window.VINILART_SPORT_CONFIG = ' . wp_json_encode( $frontend_config ) . ';',
				'before'
			);
		}
	}
}
add_action( 'wp_enqueue_scripts', 'vinilart_sport_enqueue_scripts' );

if ( ! function_exists( 'vinilart_sport_script_loader_tag' ) ) {
	/**
	 * Adiciona os atributos type="module" ao script principal compilado pelo Vite.
	 *
	 * @param string $tag    Tag HTML do script.
	 * @param string $handle Handle do script no WordPress.
	 * @param string $src    URL de origem do script.
	 * @return string Tag modificada com suporte para ES Modules.
	 */
	function vinilart_sport_script_loader_tag( $tag, $handle, $src ) {
		if ( 'vinilart-sport-app' === $handle ) {
			$tag = '<script type="module" src="' . esc_url( $src ) . '"></script>' . "\n";
		}
		return $tag;
	}
}
add_filter( 'script_loader_tag', 'vinilart_sport_script_loader_tag', 10, 3 );
