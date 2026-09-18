<?php
/**
 * Metadados adicionais para a taxonomia 'vinilart_product_cat'.
 */
defined( 'ABSPATH' ) || exit;

// Adicionar campos ao criar nova categoria
function vinilart_sport_add_category_fields( $taxonomy ) {
	?>
	<div class="form-field">
		<label for="vinilart_cat_stable_id"><?php esc_html_e( 'ID Estável', 'vinilart-sport' ); ?></label>
		<input type="text" name="vinilart_cat_stable_id" id="vinilart_cat_stable_id" value="" style="background:#f0f0f1; border-color:#dcdcde;" readonly />
		<p class="description"><?php esc_html_e( 'Gerado automaticamente ao gravar. Usado internamente pelo sistema.', 'vinilart-sport' ); ?></p>
	</div>

	<div class="form-field">
		<label for="vinilart_cat_accent"><?php esc_html_e( 'Cor de Destaque (Accent)', 'vinilart-sport' ); ?></label>
		<select name="vinilart_cat_accent" id="vinilart_cat_accent">
			<option value="magenta">Magenta</option>
			<option value="cyan">Cyan</option>
			<option value="yellow">Yellow</option>
		</select>
		<p class="description"><?php esc_html_e( 'Cor usada para realces e detalhes gráficos no site.', 'vinilart-sport' ); ?></p>
	</div>

	<div class="form-field">
		<label for="vinilart_cat_order"><?php esc_html_e( 'Ordem de Apresentação', 'vinilart-sport' ); ?></label>
		<input type="number" name="vinilart_cat_order" id="vinilart_cat_order" value="0" style="width: 80px;" />
	</div>

	<div class="form-field">
		<label for="vinilart_cat_active">
			<input type="checkbox" name="vinilart_cat_active" id="vinilart_cat_active" value="1" checked />
			<?php esc_html_e( 'Ativa no Catálogo', 'vinilart-sport' ); ?>
		</label>
	</div>
	<?php
}
add_action( 'vinilart_product_cat_add_form_fields', 'vinilart_sport_add_category_fields', 10, 1 );

// Adicionar campos ao editar categoria existente
function vinilart_sport_edit_category_fields( $term, $taxonomy ) {
	$stable_id = get_term_meta( $term->term_id, '_vinilart_cat_stable_id', true );
	$accent = get_term_meta( $term->term_id, '_vinilart_cat_accent', true ) ?: 'magenta';
	$order  = get_term_meta( $term->term_id, '_vinilart_cat_order', true ) ?: 0;
	$active = get_term_meta( $term->term_id, '_vinilart_cat_active', true );
	$active = ( '' === $active ) ? true : (bool) $active;
	?>
	<tr class="form-field">
		<th scope="row"><label for="vinilart_cat_stable_id"><?php esc_html_e( 'ID Estável', 'vinilart-sport' ); ?></label></th>
		<td>
			<input type="text" name="vinilart_cat_stable_id" id="vinilart_cat_stable_id" value="<?php echo esc_attr( $stable_id ); ?>" readonly style="background:#f0f0f1; border-color:#dcdcde;" />
			<p class="description"><?php esc_html_e( 'Identificador nativo perene (não modificar).', 'vinilart-sport' ); ?></p>
		</td>
	</tr>

	<tr class="form-field">
		<th scope="row"><label for="vinilart_cat_accent"><?php esc_html_e( 'Cor de Destaque (Accent)', 'vinilart-sport' ); ?></label></th>
		<td>
			<select name="vinilart_cat_accent" id="vinilart_cat_accent">
				<option value="magenta" <?php selected( $accent, 'magenta' ); ?>>Magenta</option>
				<option value="cyan" <?php selected( $accent, 'cyan' ); ?>>Cyan</option>
				<option value="yellow" <?php selected( $accent, 'yellow' ); ?>>Yellow</option>
			</select>
			<p class="description"><?php esc_html_e( 'Cor usada para realces e detalhes gráficos no site.', 'vinilart-sport' ); ?></p>
		</td>
	</tr>

	<tr class="form-field">
		<th scope="row"><label for="vinilart_cat_order"><?php esc_html_e( 'Ordem de Apresentação', 'vinilart-sport' ); ?></label></th>
		<td>
			<input type="number" name="vinilart_cat_order" id="vinilart_cat_order" value="<?php echo esc_attr( $order ); ?>" style="width: 80px;" />
		</td>
	</tr>

	<tr class="form-field">
		<th scope="row"><?php esc_html_e( 'Estado', 'vinilart-sport' ); ?></th>
		<td>
			<label for="vinilart_cat_active">
				<input type="checkbox" name="vinilart_cat_active" id="vinilart_cat_active" value="1" <?php checked( $active ); ?> />
				<?php esc_html_e( 'Ativa no Catálogo', 'vinilart-sport' ); ?>
			</label>
		</td>
	</tr>
	<?php
}
add_action( 'vinilart_product_cat_edit_form_fields', 'vinilart_sport_edit_category_fields', 10, 2 );

// Guardar campos adicionais
function vinilart_sport_save_category_fields( $term_id ) {
	if ( ! current_user_can( 'edit_term', $term_id ) ) {
		return;
	}

	$stable_id = get_term_meta( $term_id, '_vinilart_cat_stable_id', true );
	if ( empty( $stable_id ) ) {
		$stable_id = 'cat_' . wp_generate_uuid4();
		update_term_meta( $term_id, '_vinilart_cat_stable_id', $stable_id );
	}

	if ( isset( $_POST['vinilart_cat_accent'] ) ) {
		$accent = sanitize_text_field( $_POST['vinilart_cat_accent'] );
		if ( in_array( $accent, array( 'magenta', 'cyan', 'yellow' ), true ) ) {
			update_term_meta( $term_id, '_vinilart_cat_accent', $accent );
		}
	}

	if ( isset( $_POST['vinilart_cat_order'] ) ) {
		update_term_meta( $term_id, '_vinilart_cat_order', intval( $_POST['vinilart_cat_order'] ) );
	}

	$active = isset( $_POST['vinilart_cat_active'] ) ? 1 : 0;
	update_term_meta( $term_id, '_vinilart_cat_active', $active );
}
add_action( 'created_vinilart_product_cat', 'vinilart_sport_save_category_fields', 10, 1 );
add_action( 'edited_vinilart_product_cat', 'vinilart_sport_save_category_fields', 10, 1 );
