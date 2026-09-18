<?php
/**
 * Metadados para o Custom Post Type 'vinilart_product'.
 */
defined( 'ABSPATH' ) || exit;

class VinilArt_Sport_Product_Meta {

	public static function init() {
		add_action( 'add_meta_boxes', array( __CLASS__, 'add_meta_boxes' ) );
		add_action( 'save_post_vinilart_product', array( __CLASS__, 'save_meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'admin_scripts' ) );

		// Custom columns
		add_filter( 'manage_vinilart_product_posts_columns', array( __CLASS__, 'set_custom_columns' ) );
		add_action( 'manage_vinilart_product_posts_custom_column', array( __CLASS__, 'render_custom_columns' ), 10, 2 );
	}

	public static function admin_scripts( $hook ) {
		global $post;
		if ( ( 'post.php' === $hook || 'post-new.php' === $hook ) && $post && 'vinilart_product' === $post->post_type ) {
			wp_enqueue_media();
			ob_start();
			?>
			<style>
				.vinilart-meta-row { margin-bottom: 1em; }
				.vinilart-meta-row label { display: block; font-weight: 600; margin-bottom: 4px; }
				.vinilart-meta-row input[type="text"],
				.vinilart-meta-row input[type="number"],
				.vinilart-meta-row select { width: 100%; max-width: 400px; }
				.vinilart-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

				.vinilart-repeater-item { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
				.vinilart-repeater-item .remove-btn { color: #d63638; cursor: pointer; text-decoration: underline; }

				.vinilart-gallery-images { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
				.vinilart-gallery-image { position: relative; width: 100px; height: 100px; border: 1px solid #ccc; }
				.vinilart-gallery-image img { width: 100%; height: 100%; object-fit: cover; }
				.vinilart-gallery-image .remove-gallery { position: absolute; top: -5px; right: -5px; background: #fff; color: red; border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 18px; cursor: pointer; border: 1px solid red; font-weight: bold; }
			</style>
			<script>
				document.addEventListener('DOMContentLoaded', function() {
					// Sizes logic
					var sizesContainer = document.getElementById('vinilart_sizes_container');
					if(sizesContainer) {
						document.getElementById('vinilart_add_size').addEventListener('click', function(e) {
							e.preventDefault();
							var tpl = document.getElementById('vinilart_size_tpl').content.cloneNode(true);
							sizesContainer.appendChild(tpl);
						});
						sizesContainer.addEventListener('click', function(e) {
							if(e.target.classList.contains('remove-btn')) {
								e.target.closest('.vinilart-repeater-item').remove();
							}
						});
					}

					// Colors logic
					var colorsContainer = document.getElementById('vinilart_colors_container');
					if(colorsContainer) {
						document.getElementById('vinilart_add_color').addEventListener('click', function(e) {
							e.preventDefault();
							var tpl = document.getElementById('vinilart_color_tpl').content.cloneNode(true);
							colorsContainer.appendChild(tpl);
						});
						colorsContainer.addEventListener('click', function(e) {
							if(e.target.classList.contains('remove-btn')) {
								e.target.closest('.vinilart-repeater-item').remove();
							}
						});
					}

					// Gallery logic
					var frame;
					var galleryContainer = document.getElementById('vinilart_gallery_container');
					var galleryInput = document.getElementById('vinilart_gallery_input');

					function updateGalleryInput() {
						var ids = Array.from(galleryContainer.querySelectorAll('.vinilart-gallery-image')).map(function(el) { return el.dataset.id; });
						galleryInput.value = ids.join(',');
					}

					var addGalleryBtn = document.getElementById('vinilart_add_gallery');
					if(addGalleryBtn) {
						addGalleryBtn.addEventListener('click', function(e) {
							e.preventDefault();
							if ( frame ) { frame.open(); return; }
							frame = wp.media({
								title: 'Selecionar Imagens',
								button: { text: 'Usar como Galeria' },
								multiple: true
							});
							frame.on('select', function() {
								var attachments = frame.state().get('selection').toJSON();
								attachments.forEach(function(att) {
									var imgDiv = document.createElement('div');
									imgDiv.className = 'vinilart-gallery-image';
									imgDiv.dataset.id = att.id;
									imgDiv.innerHTML = '<img src="' + att.url + '" alt=""><div class="remove-gallery">×</div>';
									galleryContainer.appendChild(imgDiv);
								});
								updateGalleryInput();
							});
							frame.open();
						});

						galleryContainer.addEventListener('click', function(e) {
							if(e.target.classList.contains('remove-gallery')) {
								e.target.closest('.vinilart-gallery-image').remove();
								updateGalleryInput();
							}
						});
					}
				});
			</script>
			<?php
			$html = ob_get_clean();
			wp_add_inline_script( 'jquery', strip_tags( $html, '<script>' ) );
			wp_add_inline_style( 'wp-admin', strip_tags( $html, '<style>' ) );
		}
	}

	public static function add_meta_boxes() {
		add_meta_box( 'vinilart_product_commercial', __( 'Dados Comerciais & Visuais', 'vinilart-sport' ), array( __CLASS__, 'render_commercial_meta_box' ), 'vinilart_product', 'normal', 'high' );
		add_meta_box( 'vinilart_product_variants', __( 'Tamanhos & Cores', 'vinilart-sport' ), array( __CLASS__, 'render_variants_meta_box' ), 'vinilart_product', 'normal', 'default' );
		add_meta_box( 'vinilart_product_customizer', __( 'Personalizador & Galeria', 'vinilart-sport' ), array( __CLASS__, 'render_customizer_meta_box' ), 'vinilart_product', 'normal', 'default' );
		add_meta_box( 'vinilart_product_system', __( 'Sistema Interno', 'vinilart-sport' ), array( __CLASS__, 'render_system_meta_box' ), 'vinilart_product', 'side', 'low' );
	}

	public static function render_commercial_meta_box( $post ) {
		wp_nonce_field( 'vinilart_save_meta', 'vinilart_meta_nonce' );

		$short_name  = get_post_meta( $post->ID, '_vinilart_short_name', true );
		$badge       = get_post_meta( $post->ID, '_vinilart_badge', true );
		$price_mode  = get_post_meta( $post->ID, '_vinilart_price_mode', true ) ?: 'quote';
		$price       = get_post_meta( $post->ID, '_vinilart_price', true );
		$currency    = get_post_meta( $post->ID, '_vinilart_currency', true ) ?: 'EUR';
		$price_label = get_post_meta( $post->ID, '_vinilart_price_label', true );
		$shelf       = get_post_meta( $post->ID, '_vinilart_shelf', true ) ?: 'catalogo';

		$show_shop = get_post_meta( $post->ID, '_vinilart_show_in_shop', true );
		$show_shop = ( '' === $show_shop ) ? true : (bool) $show_shop;

		$show_home = get_post_meta( $post->ID, '_vinilart_show_in_home', true );
		$show_home = ( '' === $show_home ) ? false : (bool) $show_home;
		?>
		<div class="vinilart-meta-grid">
			<div>
				<div class="vinilart-meta-row">
					<label for="vinilart_short_name"><?php esc_html_e( 'Nome Curto', 'vinilart-sport' ); ?></label>
					<input type="text" name="vinilart_short_name" id="vinilart_short_name" value="<?php echo esc_attr( $short_name ); ?>" placeholder="Ex: Equipamento Principal" />
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_badge"><?php esc_html_e( 'Etiqueta (Badge)', 'vinilart-sport' ); ?></label>
					<input type="text" name="vinilart_badge" id="vinilart_badge" value="<?php echo esc_attr( $badge ); ?>" placeholder="Ex: Personalizável, Novo..." />
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_shelf"><?php esc_html_e( 'Prateleira', 'vinilart-sport' ); ?></label>
					<select name="vinilart_shelf" id="vinilart_shelf">
						<option value="catalogo" <?php selected( $shelf, 'catalogo' ); ?>>Catálogo Geral</option>
						<option value="principal" <?php selected( $shelf, 'principal' ); ?>>Destaque Principal</option>
					</select>
				</div>
				<div class="vinilart-meta-row">
					<label>
						<input type="checkbox" name="vinilart_show_in_shop" value="1" <?php checked( $show_shop ); ?> />
						<?php esc_html_e( 'Mostrar na Loja', 'vinilart-sport' ); ?>
					</label>
					<label style="margin-left: 15px;">
						<input type="checkbox" name="vinilart_show_in_home" value="1" <?php checked( $show_home ); ?> />
						<?php esc_html_e( 'Mostrar na Home', 'vinilart-sport' ); ?>
					</label>
				</div>
			</div>
			<div>
				<div class="vinilart-meta-row">
					<label for="vinilart_price_mode"><?php esc_html_e( 'Modo de Preço', 'vinilart-sport' ); ?></label>
					<select name="vinilart_price_mode" id="vinilart_price_mode">
						<option value="quote" <?php selected( $price_mode, 'quote' ); ?>>Sob Orçamento</option>
						<option value="fixed" <?php selected( $price_mode, 'fixed' ); ?>>Preço Fixo</option>
						<option value="from" <?php selected( $price_mode, 'from' ); ?>>Desde...</option>
					</select>
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_price"><?php esc_html_e( 'Preço Base (Numérico)', 'vinilart-sport' ); ?></label>
					<input type="number" step="0.01" name="vinilart_price" id="vinilart_price" value="<?php echo esc_attr( $price ); ?>" />
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_currency"><?php esc_html_e( 'Moeda', 'vinilart-sport' ); ?></label>
					<input type="text" name="vinilart_currency" id="vinilart_currency" value="<?php echo esc_attr( $currency ); ?>" />
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_price_label"><?php esc_html_e( 'Etiqueta de Preço Manual', 'vinilart-sport' ); ?></label>
					<input type="text" name="vinilart_price_label" id="vinilart_price_label" value="<?php echo esc_attr( $price_label ); ?>" placeholder="Opcional. Substitui a lógica." />
				</div>
			</div>
		</div>
		<?php
	}

	public static function render_variants_meta_box( $post ) {
		$sizes  = get_post_meta( $post->ID, '_vinilart_sizes', true );
		if ( ! is_array( $sizes ) ) $sizes = array();

		$colors = get_post_meta( $post->ID, '_vinilart_colors', true );
		if ( ! is_array( $colors ) ) $colors = array();
		?>
		<div class="vinilart-meta-grid">
			<div>
				<h4><?php esc_html_e( 'Tamanhos', 'vinilart-sport' ); ?></h4>
				<div id="vinilart_sizes_container">
					<?php foreach ( $sizes as $size ) : ?>
					<div class="vinilart-repeater-item">
						<input type="text" name="vinilart_sizes[]" value="<?php echo esc_attr( $size ); ?>" style="width:100px;" />
						<span class="remove-btn"><?php esc_html_e( 'remover', 'vinilart-sport' ); ?></span>
					</div>
					<?php endforeach; ?>
				</div>
				<button type="button" class="button" id="vinilart_add_size"><?php esc_html_e( '+ Adicionar tamanho', 'vinilart-sport' ); ?></button>

				<template id="vinilart_size_tpl">
					<div class="vinilart-repeater-item">
						<input type="text" name="vinilart_sizes[]" value="" style="width:100px;" />
						<span class="remove-btn"><?php esc_html_e( 'remover', 'vinilart-sport' ); ?></span>
					</div>
				</template>
			</div>
			<div>
				<h4><?php esc_html_e( 'Cores', 'vinilart-sport' ); ?></h4>
				<div id="vinilart_colors_container">
					<?php foreach ( $colors as $color ) : ?>
					<div class="vinilart-repeater-item">
						<input type="text" name="vinilart_colors_name[]" value="<?php echo esc_attr( $color['name'] ?? '' ); ?>" placeholder="Nome" style="width:100px;" />
						<input type="text" name="vinilart_colors_hex[]" value="<?php echo esc_attr( $color['hex'] ?? '' ); ?>" placeholder="#000000" style="width:80px;" />
						<span class="remove-btn"><?php esc_html_e( 'remover', 'vinilart-sport' ); ?></span>
					</div>
					<?php endforeach; ?>
				</div>
				<button type="button" class="button" id="vinilart_add_color"><?php esc_html_e( '+ Adicionar cor', 'vinilart-sport' ); ?></button>

				<template id="vinilart_color_tpl">
					<div class="vinilart-repeater-item">
						<input type="text" name="vinilart_colors_name[]" value="" placeholder="Nome" style="width:100px;" />
						<input type="text" name="vinilart_colors_hex[]" value="" placeholder="#000000" style="width:80px;" />
						<span class="remove-btn"><?php esc_html_e( 'remover', 'vinilart-sport' ); ?></span>
					</div>
				</template>
			</div>
		</div>
		<?php
	}

	public static function render_customizer_meta_box( $post ) {
		$customizable = get_post_meta( $post->ID, '_vinilart_customizable', true );
		$customizable = ( '' === $customizable ) ? false : (bool) $customizable;
		$config_id    = get_post_meta( $post->ID, '_vinilart_customizer_config_id', true );
		$image_fit    = get_post_meta( $post->ID, '_vinilart_image_fit', true ) ?: 'contain';

		$gallery_arr  = get_post_meta( $post->ID, '_vinilart_gallery', true );
		if ( ! is_array( $gallery_arr ) ) {
			$gallery_arr = array();
		}
		$gallery_str  = implode( ',', $gallery_arr );
		?>
		<div class="vinilart-meta-grid">
			<div>
				<h4><?php esc_html_e( 'Personalização', 'vinilart-sport' ); ?></h4>
				<div class="vinilart-meta-row">
					<label>
						<input type="checkbox" name="vinilart_customizable" value="1" <?php checked( $customizable ); ?> />
						<?php esc_html_e( 'Produto permite personalização', 'vinilart-sport' ); ?>
					</label>
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_customizer_config_id"><?php esc_html_e( 'ID da Configuração', 'vinilart-sport' ); ?></label>
					<input type="text" name="vinilart_customizer_config_id" id="vinilart_customizer_config_id" value="<?php echo esc_attr( $config_id ); ?>" placeholder="Referência interna (opcional nesta fase)" />
				</div>
				<div class="vinilart-meta-row">
					<label for="vinilart_image_fit"><?php esc_html_e( 'Enquadramento da Imagem Principal', 'vinilart-sport' ); ?></label>
					<select name="vinilart_image_fit" id="vinilart_image_fit">
						<option value="contain" <?php selected( $image_fit, 'contain' ); ?>>Mockup / Conter</option>
						<option value="cover" <?php selected( $image_fit, 'cover' ); ?>>Fotografia Real / Preencher</option>
					</select>
				</div>
			</div>
			<div>
				<h4><?php esc_html_e( 'Galeria de Imagens', 'vinilart-sport' ); ?></h4>
				<div id="vinilart_gallery_container" class="vinilart-gallery-images">
					<?php
					foreach ( $gallery_arr as $att_id ) {
						$url = wp_get_attachment_image_url( $att_id, 'thumbnail' );
						if ( $url ) {
							echo '<div class="vinilart-gallery-image" data-id="' . esc_attr( $att_id ) . '"><img src="' . esc_url( $url ) . '" alt=""><div class="remove-gallery">×</div></div>';
						}
					}
					?>
				</div>
				<input type="hidden" name="vinilart_gallery" id="vinilart_gallery_input" value="<?php echo esc_attr( $gallery_str ); ?>" />
				<button type="button" class="button" id="vinilart_add_gallery"><?php esc_html_e( 'Gerir Galeria', 'vinilart-sport' ); ?></button>
			</div>
		</div>
		<?php
	}

	public static function render_system_meta_box( $post ) {
		$stable_id = get_post_meta( $post->ID, '_vinilart_stable_id', true );
		?>
		<div class="vinilart-meta-row">
			<label><?php esc_html_e( 'ID Estável (Frontend)', 'vinilart-sport' ); ?></label>
			<input type="text" name="vinilart_stable_id" value="<?php echo esc_attr( $stable_id ); ?>" readonly style="background:#f0f0f1; border-color:#dcdcde; width:100%; box-sizing:border-box;" />
			<p class="description"><?php esc_html_e( 'Identificador único persistente gerado automaticamente.', 'vinilart-sport' ); ?></p>
		</div>
		<?php
	}

	public static function save_meta_boxes( $post_id ) {
		if ( ! isset( $_POST['vinilart_meta_nonce'] ) || ! wp_verify_nonce( $_POST['vinilart_meta_nonce'], 'vinilart_save_meta' ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// Stable ID
		$stable_id = get_post_meta( $post_id, '_vinilart_stable_id', true );
		if ( empty( $stable_id ) ) {
			$stable_id = 'prod_' . wp_generate_uuid4();
			update_post_meta( $post_id, '_vinilart_stable_id', $stable_id );
		}

		// Text/Select fields
		$fields = array(
			'vinilart_short_name',
			'vinilart_badge',
			'vinilart_shelf',
			'vinilart_price_mode',
			'vinilart_price',
			'vinilart_currency',
			'vinilart_price_label',
			'vinilart_image_fit',
			'vinilart_customizer_config_id'
		);
		foreach ( $fields as $field ) {
			if ( isset( $_POST[ $field ] ) ) {
				update_post_meta( $post_id, "_{$field}", sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
			}
		}

		// Gallery array of integers
		if ( isset( $_POST['vinilart_gallery'] ) ) {
			$gallery_str = sanitize_text_field( wp_unslash( $_POST['vinilart_gallery'] ) );
			$gallery_ids = array_filter( array_map( 'intval', explode( ',', (string) $gallery_str ) ) );
			if ( empty( $gallery_ids ) ) {
				delete_post_meta( $post_id, '_vinilart_gallery' );
			} else {
				update_post_meta( $post_id, '_vinilart_gallery', array_values( $gallery_ids ) );
			}
		}

		// Checkboxes
		update_post_meta( $post_id, '_vinilart_show_in_shop', isset( $_POST['vinilart_show_in_shop'] ) ? 1 : 0 );
		update_post_meta( $post_id, '_vinilart_show_in_home', isset( $_POST['vinilart_show_in_home'] ) ? 1 : 0 );
		update_post_meta( $post_id, '_vinilart_customizable', isset( $_POST['vinilart_customizable'] ) ? 1 : 0 );

		// Variants: Sizes
		if ( isset( $_POST['vinilart_sizes'] ) && is_array( $_POST['vinilart_sizes'] ) ) {
			$clean_sizes = array_values( array_filter( array_map( 'sanitize_text_field', wp_unslash( $_POST['vinilart_sizes'] ) ) ) );
			update_post_meta( $post_id, '_vinilart_sizes', $clean_sizes );
		} else {
			delete_post_meta( $post_id, '_vinilart_sizes' );
		}

		// Variants: Colors
		if ( isset( $_POST['vinilart_colors_name'], $_POST['vinilart_colors_hex'] ) && is_array( $_POST['vinilart_colors_name'] ) ) {
			$names = array_map( 'sanitize_text_field', wp_unslash( $_POST['vinilart_colors_name'] ) );
			$hexes = array_map( 'sanitize_text_field', wp_unslash( $_POST['vinilart_colors_hex'] ) );
			$colors = array();
			foreach ( $names as $index => $name ) {
				if ( ! empty( $name ) ) {
					$colors[] = array(
						'name' => $name,
						'hex'  => $hexes[ $index ] ?? ''
					);
				}
			}
			update_post_meta( $post_id, '_vinilart_colors', $colors );
		} else {
			delete_post_meta( $post_id, '_vinilart_colors' );
		}
	}

	public static function set_custom_columns( $columns ) {
		$new_columns = array();
		foreach ( $columns as $key => $title ) {
			if ( 'title' === $key ) {
				$new_columns['vinilart_thumb'] = __( 'Imagem', 'vinilart-sport' );
			}
			$new_columns[ $key ] = $title;
			if ( 'title' === $key ) {
				$new_columns['vinilart_cat'] = __( 'Categoria', 'vinilart-sport' );
				$new_columns['vinilart_price'] = __( 'Preço', 'vinilart-sport' );
				$new_columns['vinilart_cust'] = __( 'Personalização', 'vinilart-sport' );
			}
		}
		return $new_columns;
	}

	public static function render_custom_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'vinilart_thumb':
				echo get_the_post_thumbnail( $post_id, array( 50, 50 ), array( 'style' => 'border-radius:4px; object-fit:cover;' ) );
				break;
			case 'vinilart_cat':
				$terms = get_the_term_list( $post_id, 'vinilart_product_cat', '', ', ', '' );
				if ( is_string( $terms ) ) {
					echo wp_kses_post( $terms );
				} else {
					echo '—';
				}
				break;
			case 'vinilart_price':
				$mode = get_post_meta( $post_id, '_vinilart_price_mode', true );
				$val = get_post_meta( $post_id, '_vinilart_price', true );
				$cur = get_post_meta( $post_id, '_vinilart_currency', true ) ?: 'EUR';
				if ( 'quote' === $mode ) {
					echo esc_html__( 'Sob consulta', 'vinilart-sport' );
				} elseif ( 'from' === $mode ) {
					echo 'Desde ' . esc_html( $val ) . ' ' . esc_html( $cur );
				} else {
					echo esc_html( $val ) . ' ' . esc_html( $cur );
				}
				break;
			case 'vinilart_cust':
				$cust = get_post_meta( $post_id, '_vinilart_customizable', true );
				if ( $cust ) {
					echo '<span style="color:#46b450; font-weight:bold;">✔ Sim</span>';
				} else {
					echo '<span style="color:#a0a5aa;">✖ Não</span>';
				}
				break;
		}
	}
}

VinilArt_Sport_Product_Meta::init();
