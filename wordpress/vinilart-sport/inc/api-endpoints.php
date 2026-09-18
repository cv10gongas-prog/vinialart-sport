<?php
/**
 * Custom REST API Endpoints para Produtos e Categorias.
 */
defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', 'vinilart_sport_register_custom_endpoints' );

function vinilart_sport_register_custom_endpoints() {
	register_rest_route( 'vinilart-sport/v1', '/categories', array(
		'methods'             => 'GET',
		'callback'            => 'vinilart_sport_get_categories',
		'permission_callback' => '__return_true',
	) );

	register_rest_route( 'vinilart-sport/v1', '/products', array(
		'methods'             => 'GET',
		'callback'            => 'vinilart_sport_get_products',
		'permission_callback' => '__return_true',
	) );

	// Endpoint para obter um produto específico por stable_id ou slug
	register_rest_route( 'vinilart-sport/v1', '/products/(?P<identifier>[a-zA-Z0-9_\-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'vinilart_sport_get_product',
		'permission_callback' => '__return_true',
	) );
}

function vinilart_sport_get_categories( $request ) {
	$terms = get_terms( array(
		'taxonomy'   => 'vinilart_product_cat',
		'hide_empty' => false,
	) );

	if ( is_wp_error( $terms ) ) {
		return new WP_Error( 'no_categories', 'Sem categorias', array( 'status' => 404 ) );
	}

	$categories = array();
	foreach ( $terms as $term ) {
		$stable_id = get_term_meta( $term->term_id, '_vinilart_cat_stable_id', true );
		if ( empty( $stable_id ) ) {
			$stable_id = 'cat_' . $term->term_id;
		}

		$accent = get_term_meta( $term->term_id, '_vinilart_cat_accent', true ) ?: 'magenta';
		$order  = get_term_meta( $term->term_id, '_vinilart_cat_order', true ) ?: 0;
		$active = get_term_meta( $term->term_id, '_vinilart_cat_active', true );
		$active = ( '' === $active ) ? true : (bool) $active;

		$categories[] = array(
			'id'          => $stable_id,
			'name'        => $term->name,
			'slug'        => $term->slug,
			'description' => $term->description,
			'order'       => (int) $order,
			'active'      => $active,
			'accent'      => $accent,
			'image'       => null // Implementação de imagem futuramente se necessário
		);
	}

	usort( $categories, function( $a, $b ) {
		return $a['order'] - $b['order'];
	});

	return rest_ensure_response( $categories );
}

function vinilart_sport_get_products( $request ) {
	$args = array(
		'post_type'      => 'vinilart_product',
		'post_status'    => 'publish', // Só produtos publicados
		'posts_per_page' => -1,
		'orderby'        => 'menu_order',
		'order'          => 'ASC',
	);

	if ( $request->get_param( 'slug' ) ) {
		$args['name'] = sanitize_title( $request->get_param( 'slug' ) );
	}

	$query = new WP_Query( $args );
	$products = array();

	foreach ( $query->posts as $post ) {
		$stable_id = get_post_meta( $post->ID, '_vinilart_stable_id', true );
		if ( empty( $stable_id ) ) {
			$stable_id = 'prod_' . $post->ID; // fallback
		}

		$short_name  = get_post_meta( $post->ID, '_vinilart_short_name', true );
		$badge       = get_post_meta( $post->ID, '_vinilart_badge', true );
		$price_mode  = get_post_meta( $post->ID, '_vinilart_price_mode', true ) ?: 'quote';
		$price       = get_post_meta( $post->ID, '_vinilart_price', true );
		$currency    = get_post_meta( $post->ID, '_vinilart_currency', true ) ?: 'EUR';
		$price_label = get_post_meta( $post->ID, '_vinilart_price_label', true );

		$shelf       = get_post_meta( $post->ID, '_vinilart_shelf', true ) ?: 'catalogo';
		$show_shop   = get_post_meta( $post->ID, '_vinilart_show_in_shop', true );
		$show_home   = get_post_meta( $post->ID, '_vinilart_show_in_home', true );
		$image_fit   = get_post_meta( $post->ID, '_vinilart_image_fit', true ) ?: 'contain';

		$customizable = get_post_meta( $post->ID, '_vinilart_customizable', true );
		$config_id    = get_post_meta( $post->ID, '_vinilart_customizer_config_id', true );

		$terms = get_the_terms( $post->ID, 'vinilart_product_cat' );
		$category_id = '';
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$category_id = get_term_meta( $terms[0]->term_id, '_vinilart_cat_stable_id', true );
			if ( empty( $category_id ) ) {
				$category_id = 'cat_' . $terms[0]->term_id;
			}
		}

		$image_url = get_the_post_thumbnail_url( $post->ID, 'full' ) ?: '';

		$gallery_arr  = get_post_meta( $post->ID, '_vinilart_gallery', true );
		if ( ! is_array( $gallery_arr ) ) {
			$gallery_arr = array();
		}
		$gallery_urls = array();
		foreach ( $gallery_arr as $att_id ) {
			$url = wp_get_attachment_image_url( $att_id, 'full' );
			if ( $url ) $gallery_urls[] = $url;
		}

		$sizes  = get_post_meta( $post->ID, '_vinilart_sizes', true );
		$colors = get_post_meta( $post->ID, '_vinilart_colors', true );

		$price_mode  = get_post_meta( $post->ID, '_vinilart_price_mode', true ) ?: 'quote';
		$price       = get_post_meta( $post->ID, '_vinilart_price', true );
		$currency    = get_post_meta( $post->ID, '_vinilart_currency', true ) ?: 'EUR';
		$price_label = get_post_meta( $post->ID, '_vinilart_price_label', true );

		$products[] = array(
			'id'               => $stable_id,
			'slug'             => $post->post_name,
			'name'             => $post->post_title,
			'shortName'        => $short_name ?: $post->post_title,
			'categoryId'       => $category_id,
			'shortDescription' => $post->post_excerpt,
			'longDescription'  => $post->post_content,
			'image'            => $image_url,
			'imageFit'         => $image_fit,
			'gallery'          => $gallery_urls,
			'commercial'       => array(
				'priceMode'  => $price_mode,
				'price'      => is_numeric( $price ) ? (float) $price : null,
				'currency'   => $currency,
				'priceLabel' => $price_label,
			),
			'badge'            => $badge,
			'featured'         => false, // Será gerido no módulo de destaques/Home
			'order'            => $post->menu_order,
			'status'           => $post->post_status,
			'shelf'            => $shelf,
			'showInShop'       => ( '' === $show_shop ) ? true : (bool) $show_shop,
			'showInHome'       => (bool) $show_home,
			'customizable'     => (bool) $customizable,
			'customizerConfigId' => $config_id,
			'variants'         => array(
				'sizes'  => is_array( $sizes ) ? $sizes : array(),
				'colors' => is_array( $colors ) ? $colors : array(),
			)
		);
	}

	return rest_ensure_response( $products );
}

function vinilart_sport_get_product( $request ) {
	$identifier = $request->get_param( 'identifier' );

	$args = array(
		'post_type'      => 'vinilart_product',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
	);

	// Try by stable ID first
	$stable_query = new WP_Query( array_merge( $args, array(
		'meta_key'   => '_vinilart_stable_id',
		'meta_value' => $identifier,
	) ) );

	if ( $stable_query->have_posts() ) {
		$post = $stable_query->posts[0];
	} else {
		// Fallback to slug
		$slug_query = new WP_Query( array_merge( $args, array(
			'name' => sanitize_title( $identifier ),
		) ) );
		if ( $slug_query->have_posts() ) {
			$post = $slug_query->posts[0];
		} else {
			return new WP_Error( 'not_found', 'Produto não encontrado', array( 'status' => 404 ) );
		}
	}

	$stable_id = get_post_meta( $post->ID, '_vinilart_stable_id', true );
	if ( empty( $stable_id ) ) {
		$stable_id = 'prod_' . $post->ID;
	}

	$short_name  = get_post_meta( $post->ID, '_vinilart_short_name', true );
	$badge       = get_post_meta( $post->ID, '_vinilart_badge', true );
	$price_mode  = get_post_meta( $post->ID, '_vinilart_price_mode', true ) ?: 'quote';
	$price       = get_post_meta( $post->ID, '_vinilart_price', true );
	$currency    = get_post_meta( $post->ID, '_vinilart_currency', true ) ?: 'EUR';
	$price_label = get_post_meta( $post->ID, '_vinilart_price_label', true );

	$shelf       = get_post_meta( $post->ID, '_vinilart_shelf', true ) ?: 'catalogo';
	$show_shop   = get_post_meta( $post->ID, '_vinilart_show_in_shop', true );
	$show_home   = get_post_meta( $post->ID, '_vinilart_show_in_home', true );
	$image_fit   = get_post_meta( $post->ID, '_vinilart_image_fit', true ) ?: 'contain';

	$customizable = get_post_meta( $post->ID, '_vinilart_customizable', true );
	$config_id    = get_post_meta( $post->ID, '_vinilart_customizer_config_id', true );

	$terms = get_the_terms( $post->ID, 'vinilart_product_cat' );
	$category_id = '';
	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
		$category_id = get_term_meta( $terms[0]->term_id, '_vinilart_cat_stable_id', true );
		if ( empty( $category_id ) ) {
			$category_id = 'cat_' . $terms[0]->term_id;
		}
	}

	$image_url = get_the_post_thumbnail_url( $post->ID, 'full' ) ?: '';

	$gallery_arr  = get_post_meta( $post->ID, '_vinilart_gallery', true );
	if ( ! is_array( $gallery_arr ) ) {
		$gallery_arr = array();
	}
	$gallery_urls = array();
	foreach ( $gallery_arr as $att_id ) {
		$url = wp_get_attachment_image_url( $att_id, 'full' );
		if ( $url ) $gallery_urls[] = $url;
	}

	$sizes  = get_post_meta( $post->ID, '_vinilart_sizes', true );
	$colors = get_post_meta( $post->ID, '_vinilart_colors', true );

	$product_dto = array(
		'id'               => $stable_id,
		'slug'             => $post->post_name,
		'name'             => $post->post_title,
		'shortName'        => $short_name ?: $post->post_title,
		'categoryId'       => $category_id,
		'shortDescription' => $post->post_excerpt,
		'longDescription'  => $post->post_content,
		'image'            => $image_url,
		'imageFit'         => $image_fit,
		'gallery'          => $gallery_urls,
		'commercial'       => array(
			'priceMode'  => $price_mode,
			'price'      => is_numeric( $price ) ? (float) $price : null,
			'currency'   => $currency,
			'priceLabel' => $price_label,
		),
		'badge'            => $badge,
		'featured'         => false,
		'order'            => $post->menu_order,
		'status'           => $post->post_status,
		'shelf'            => $shelf,
		'showInShop'       => ( '' === $show_shop ) ? true : (bool) $show_shop,
		'showInHome'       => (bool) $show_home,
		'customizable'     => (bool) $customizable,
		'customizerConfigId' => $config_id,
		'variants'         => array(
			'sizes'  => is_array( $sizes ) ? $sizes : array(),
			'colors' => is_array( $colors ) ? $colors : array(),
		)
	);

	return rest_ensure_response( $product_dto );
}
