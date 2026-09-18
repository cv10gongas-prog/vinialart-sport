<?php
/**
 * Registo e gestão do Custom Post Type 'vinilart_product'.
 */
defined( 'ABSPATH' ) || exit;

function vinilart_sport_register_cpt_product() {
	$labels = array(
		'name'                  => 'Produtos',
		'singular_name'         => 'Produto',
		'menu_name'             => 'Produtos',
		'name_admin_bar'        => 'Produto',
		'add_new'               => 'Adicionar Novo',
		'add_new_item'          => 'Adicionar Novo Produto',
		'new_item'              => 'Novo Produto',
		'edit_item'             => 'Editar Produto',
		'view_item'             => 'Ver Produto',
		'all_items'             => 'Produtos',
		'search_items'          => 'Pesquisar Produtos',
		'parent_item_colon'     => 'Produtos Pai:',
		'not_found'             => 'Nenhum produto encontrado.',
		'not_found_in_trash'    => 'Nenhum produto encontrado no Lixo.',
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => 'vinilart-sport',
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'produtos' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		'show_in_rest'       => true,
		'rest_base'          => 'vinilart-products', // Nativo para uso em WP Core, nosso custom endpoint cuida do site front-end.
	);

	register_post_type( 'vinilart_product', $args );
}
add_action( 'init', 'vinilart_sport_register_cpt_product' );
