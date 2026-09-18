<?php
/**
 * Gestão de rotas e deep-links para o frontend React no WordPress.
 *
 * Garante que rotas internas (/loja, /produto/*, /personalizar, etc.)
 * entregam a shell da aplicação com status HTTP 200 sem quebrar deep-links.
 *
 * @package VinilArt_Sport
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'vinilart_sport_get_frontend_routes' ) ) {
	/**
	 * Lista as rotas geridas pelo frontend da aplicação.
	 *
	 * @return array Lista de slugs de rotas registadas.
	 */
	function vinilart_sport_get_frontend_routes() {
		return array(
			'loja',
			'personalizar',
			'portfolio',
			'contactos',
			'carrinho',
			'checkout',
			'adeptos',
			'equipamentos',
		);
	}
}

if ( ! function_exists( 'vinilart_sport_register_query_vars' ) ) {
	/**
	 * Regista variáveis de consulta personalizadas para o routing.
	 *
	 * @param array $vars Variáveis de consulta existentes.
	 * @return array Variáveis atualizadas.
	 */
	function vinilart_sport_register_query_vars( $vars ) {
		$vars[] = 'vinilart_route';
		$vars[] = 'vinilart_slug';
		return $vars;
	}
}
add_filter( 'query_vars', 'vinilart_sport_register_query_vars' );

if ( ! function_exists( 'vinilart_sport_add_rewrite_rules' ) ) {
	/**
	 * Adiciona regras de reescrita de URL para as rotas da aplicação.
	 */
	function vinilart_sport_add_rewrite_rules() {
		// Rota dinâmica de produto com slug
		add_rewrite_rule(
			'^produto/([^/]+)/?$',
			'index.php?vinilart_route=produto&vinilart_slug=$matches[1]',
			'top'
		);

		// Rotas estáticas da aplicação
		$routes = vinilart_sport_get_frontend_routes();
		foreach ( $routes as $route ) {
			add_rewrite_rule(
				'^' . preg_quote( $route, '/' ) . '/?$',
				'index.php?vinilart_route=' . $route,
				'top'
			);
		}
	}
}
add_action( 'init', 'vinilart_sport_add_rewrite_rules' );

if ( ! function_exists( 'vinilart_sport_template_include' ) ) {
	/**
	 * Interceta o carregamento de templates para servir a shell da aplicação quando uma rota é acedida.
	 *
	 * @param string $template Caminho para o template padrão do WordPress.
	 * @return string Caminho para o template a utilizar.
	 */
	function vinilart_sport_template_include( $template ) {
		$route = get_query_var( 'vinilart_route' );

		if ( ! empty( $route ) ) {
			// Forçar status HTTP 200 para que o servidor não responda 404 em deep-links
			status_header( 200 );
			$app_shell = VINILART_SPORT_DIR . '/index.php';
			if ( file_exists( $app_shell ) ) {
				return $app_shell;
			}
		}

		return $template;
	}
}
add_filter( 'template_include', 'vinilart_sport_template_include' );

if ( ! function_exists( 'vinilart_sport_activate_theme' ) ) {
	/**
	 * Atualiza as regras de reescrita na ativação do tema.
	 */
	function vinilart_sport_activate_theme() {
		vinilart_sport_add_rewrite_rules();
		flush_rewrite_rules();
	}
}
add_action( 'after_switch_theme', 'vinilart_sport_activate_theme' );

if ( ! function_exists( 'vinilart_sport_deactivate_theme' ) ) {
	/**
	 * Limpa as regras de reescrita na desativação do tema.
	 */
	function vinilart_sport_deactivate_theme() {
		flush_rewrite_rules();
	}
}
add_action( 'switch_theme', 'vinilart_sport_deactivate_theme' );
