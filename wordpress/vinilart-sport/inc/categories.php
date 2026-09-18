<?php
/**
 * Registo da Taxonomy 'vinilart_product_cat'.
 */
defined( 'ABSPATH' ) || exit;

function vinilart_sport_register_tax_product_cat() {
	$labels = array(
		'name'              => 'Categorias',
		'singular_name'     => 'Categoria',
		'search_items'      => 'Pesquisar Categorias',
		'all_items'         => 'Todas as Categorias',
		'parent_item'       => 'Categoria Pai',
		'parent_item_colon' => 'Categoria Pai:',
		'edit_item'         => 'Editar Categoria',
		'update_item'       => 'Atualizar Categoria',
		'add_new_item'      => 'Adicionar Nova Categoria',
		'new_item_name'     => 'Novo Nome de Categoria',
		'menu_name'         => 'Categorias',
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'categoria-produto' ),
		'show_in_rest'      => true,
        'show_in_menu'      => true
	);

	register_taxonomy( 'vinilart_product_cat', array( 'vinilart_product' ), $args );
}
add_action( 'init', 'vinilart_sport_register_tax_product_cat' );
