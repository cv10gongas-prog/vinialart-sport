<?php
/**
 * Importador/Seeder do Catálogo React atual.
 * ATENÇÃO: MIGRAÇÃO INICIAL
 * Usado exclusivamente como One-Time Migration Seed para a Base de Dados.
 * Não é e não deve ser usado como segunda fonte permanente do sistema.
 * Idempotente: Verifica existência por stable ID primeiro e não duplica nem sobrescreve.
 */
defined( 'ABSPATH' ) || exit;

function vinilart_sport_seed_catalog() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return false;
	}

	// Categorias base
	$categories = array(
		array( 'stable_id' => 'cat-caneleiras', 'name' => 'Caneleiras', 'slug' => 'caneleiras', 'accent' => 'magenta' ),
		array( 'stable_id' => 'cat-equipamentos', 'name' => 'Equipamentos', 'slug' => 'equipamentos', 'accent' => 'cyan' ),
		array( 'stable_id' => 'cat-bandeiras', 'name' => 'Bandeiras', 'slug' => 'bandeiras', 'accent' => 'yellow' ),
		array( 'stable_id' => 'cat-adeptos', 'name' => 'Artigos para Adeptos', 'slug' => 'adeptos', 'accent' => 'magenta' ),
		array( 'stable_id' => 'cat-estampagem', 'name' => 'Estampagem', 'slug' => 'estampagem', 'accent' => 'cyan' ),
		array( 'stable_id' => 'cat-impressao', 'name' => 'Impressão', 'slug' => 'impressao', 'accent' => 'yellow' ),
	);

	foreach ( $categories as $i => $cat ) {
		// Validar existência por stable ID via WP_Term_Query
		$existing_terms = get_terms( array(
			'taxonomy'   => 'vinilart_product_cat',
			'hide_empty' => false,
			'meta_key'   => '_vinilart_cat_stable_id',
			'meta_value' => $cat['stable_id'],
		) );

		$term_id = null;
		if ( ! empty( $existing_terms ) && ! is_wp_error( $existing_terms ) ) {
			$term_id = $existing_terms[0]->term_id;
		} else {
			$term = get_term_by( 'slug', $cat['slug'], 'vinilart_product_cat' );
			if ( $term ) {
				$term_id = $term->term_id;
			}
		}

		if ( ! $term_id ) {
			$inserted = wp_insert_term( $cat['name'], 'vinilart_product_cat', array( 'slug' => $cat['slug'] ) );
			if ( ! is_wp_error( $inserted ) ) {
				$term_id = $inserted['term_id'];
			}
		}

		if ( $term_id ) {
			// Apenas escreve o meta se for inicial, para não esmagar futuramente
			if ( ! get_term_meta( $term_id, '_vinilart_cat_stable_id', true ) ) {
				update_term_meta( $term_id, '_vinilart_cat_stable_id', $cat['stable_id'] );
				update_term_meta( $term_id, '_vinilart_cat_accent', $cat['accent'] );
				update_term_meta( $term_id, '_vinilart_cat_order', ( $i + 1 ) * 10 );
				update_term_meta( $term_id, '_vinilart_cat_active', 1 );
			}
		}
	}

	// Produtos
	$products = array(
		array(
			'stable_id'   => 'prod-caneleiras-personalizadas',
			'slug'        => 'caneleiras-personalizadas',
			'name'        => 'Caneleiras Personalizadas',
			'cat_slug'    => 'caneleiras',
			'price_label' => '', // Fica vazio para aplicar Since 19,90€ (from mode)
			'price_mode'  => 'from',
			'price'       => 19.9,
			'currency'    => 'EUR',
			'badge'       => 'Personalizável',
			'desc'        => 'O teu design nas duas caneleiras, com personalização independente de cada lado.',
			'cust'        => true,
		),
		array(
			'stable_id'   => 'prod-equipamento-personalizado',
			'slug'        => 'equipamento-personalizado',
			'name'        => 'Equipamento Personalizado',
			'cat_slug'    => 'equipamentos',
			'price_label' => 'Preço sob consulta',
			'price_mode'  => 'quote',
			'badge'       => 'Personalizável',
			'desc'        => 'Personaliza a frente e as costas com a identidade da tua equipa.',
			'cust'        => true,
		),
		array(
			'stable_id'   => 'prod-bandeira-personalizada',
			'slug'        => 'bandeira-personalizada',
			'name'        => 'Bandeira Personalizada',
			'cat_slug'    => 'bandeiras',
			'price_label' => 'Preço sob consulta',
			'price_mode'  => 'quote',
			'badge'       => 'Personalizável',
			'desc'        => 'As tuas cores e símbolos numa bandeira personalizada.',
			'cust'        => true,
		),
		array(
			'stable_id'   => 'prod-artigos-adeptos',
			'slug'        => 'artigos-adeptos',
			'name'        => 'Artigos para Adeptos',
			'cat_slug'    => 'adeptos',
			'price_label' => 'Preço sob consulta',
			'price_mode'  => 'quote',
			'badge'       => 'Personalizável',
			'desc'        => 'Bandeiras personalizadas e outros artigos de apoio, sob consulta.',
			'cust'        => false,
		),
		array(
			'stable_id'   => 'prod-estampagem',
			'slug'        => 'estampagem',
			'name'        => 'Estampagem',
			'cat_slug'    => 'estampagem',
			'price_label' => 'Preço sob consulta',
			'price_mode'  => 'quote',
			'badge'       => 'Personalizável',
			'desc'        => 'Nomes, números, emblemas e grafismos nas tuas peças desportivas.',
			'cust'        => true,
		),
		array(
			'stable_id'   => 'prod-impressao',
			'slug'        => 'impressao',
			'name'        => 'Impressão',
			'cat_slug'    => 'impressao',
			'price_label' => 'Preço sob consulta',
			'price_mode'  => 'quote',
			'badge'       => 'Personalizável',
			'desc'        => 'Envia o teu ficheiro e indica as quantidades, medidas e materiais pretendidos.',
			'cust'        => false,
		),
	);

	foreach ( $products as $i => $p ) {
		// Verify se já existe by Stable ID EXATAMENTE
		$args = array(
			'post_type'  => 'vinilart_product',
			'meta_key'   => '_vinilart_stable_id',
			'meta_value' => $p['stable_id'],
			'post_status'=> 'any',
			'numberposts'=> 1
		);
		$existing = get_posts( $args );

		// Se não encontrou por Meta ID, valida por slug fallback, para garantir zero duplicados
		if ( empty( $existing ) ) {
			$args = array(
				'post_type'  => 'vinilart_product',
				'name'       => $p['slug'],
				'post_status'=> 'any',
				'numberposts'=> 1
			);
			$existing = get_posts( $args );
		}

		if ( empty( $existing ) ) {
			$post_id = wp_insert_post( array(
				'post_title'   => $p['name'],
				'post_name'    => $p['slug'],
				'post_status'  => 'publish',
				'post_type'    => 'vinilart_product',
				'post_content' => $p['desc'],
				'menu_order'   => ( $i + 1 ) * 10
			) );

			if ( $post_id && ! is_wp_error( $post_id ) ) {
				update_post_meta( $post_id, '_vinilart_stable_id', $p['stable_id'] );
				update_post_meta( $post_id, '_vinilart_price_label', $p['price_label'] );
				update_post_meta( $post_id, '_vinilart_price_mode', $p['price_mode'] );
				if ( isset( $p['price'] ) ) update_post_meta( $post_id, '_vinilart_price', $p['price'] );
				if ( isset( $p['currency'] ) ) update_post_meta( $post_id, '_vinilart_currency', $p['currency'] );
				update_post_meta( $post_id, '_vinilart_badge', $p['badge'] );
				update_post_meta( $post_id, '_vinilart_customizable', $p['cust'] ? 1 : 0 );
				update_post_meta( $post_id, '_vinilart_show_in_shop', 1 );

				$term = get_term_by( 'slug', $p['cat_slug'], 'vinilart_product_cat' );
				if ( $term ) {
					wp_set_object_terms( $post_id, $term->term_id, 'vinilart_product_cat' );
				}
			}
		}
	}

	update_option( 'vinilart_catalog_seeded', 'yes' );
	return true;
}

// Ligar à ação do painel
add_action( 'admin_init', function() {
	if ( isset( $_GET['vinilart_seed_catalog'] ) && current_user_can( 'manage_options' ) ) {
		check_admin_referer( 'seed_catalog' );
		vinilart_sport_seed_catalog();
		wp_redirect( admin_url( 'admin.php?page=vinilart-sport&seeded=1' ) );
		exit;
	}
});
