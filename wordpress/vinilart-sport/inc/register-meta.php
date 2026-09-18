<?php
/**
 * Registo formal dos metadados para tipos complexos e garantias de schema REST.
 */
defined( 'ABSPATH' ) || exit;

function vinilart_sport_register_cpt_meta() {
	// Sizes: Array of strings
	register_post_meta( 'vinilart_product', '_vinilart_sizes', array(
		'type'         => 'array',
		'description'  => 'Tamanhos disponíveis',
		'single'       => true,
		'show_in_rest' => array(
			'schema' => array(
				'type'  => 'array',
				'items' => array( 'type' => 'string' ),
			),
		),
	) );

	// Colors: Array of objects { name, hex }
	register_post_meta( 'vinilart_product', '_vinilart_colors', array(
		'type'         => 'array',
		'description'  => 'Cores disponíveis',
		'single'       => true,
		'show_in_rest' => array(
			'schema' => array(
				'type'  => 'array',
				'items' => array(
					'type'       => 'object',
					'properties' => array(
						'name' => array( 'type' => 'string' ),
						'hex'  => array( 'type' => 'string' ),
					),
				),
			),
		),
	) );

	// Gallery: Array of integer integers
	register_post_meta( 'vinilart_product', '_vinilart_gallery', array(
		'type'         => 'array',
		'description'  => 'IDs da Galeria',
		'single'       => true,
		'show_in_rest' => array(
			'schema' => array(
				'type'  => 'array',
				'items' => array( 'type' => 'integer' ),
			),
		),
	) );
}
add_action( 'init', 'vinilart_sport_register_cpt_meta' );
