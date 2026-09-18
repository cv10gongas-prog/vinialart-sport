<?php
/**
 * Infraestrutura base de administração do tema VinilArt Sport no wp-admin.
 *
 * Cria o menu principal e os placeholders técnicos discretos para as futuras fases
 * de gestão de dados (Produtos, Categorias, Personalizador, Portefólio, Contactos, Pedidos, Configurações).
 *
 * @package VinilArt_Sport
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'vinilart_sport_add_admin_menu' ) ) {
	/**
	 * Regista o menu principal e submenus de administração.
	 */
	function vinilart_sport_add_admin_menu() {
		// Menu Principal
		add_menu_page(
			__( 'VinilArt Sport', 'vinilart-sport' ),
			__( 'VinilArt Sport', 'vinilart-sport' ),
			'manage_options',
			'vinilart-sport',
			'vinilart_sport_render_admin_dashboard',
			'dashicons-shield',
			28
		);

		// Submenus (fundação para fases futuras)
		$submenus = array(
			'vinilart-sport'               => __( 'Visão Geral', 'vinilart-sport' ),
			'vinilart-sport-personalizador' => __( 'Personalizador', 'vinilart-sport' ),
			'vinilart-sport-portfolio'      => __( 'Portefólio', 'vinilart-sport' ),
			'vinilart-sport-contactos'      => __( 'Contactos', 'vinilart-sport' ),
			'vinilart-sport-pedidos'        => __( 'Pedidos', 'vinilart-sport' ),
			'vinilart-sport-configuracoes'  => __( 'Configurações', 'vinilart-sport' ),
		);

		foreach ( $submenus as $slug => $title ) {
			if ( 'vinilart-sport' === $slug ) {
				continue; // Já registado como página principal
			}
			add_submenu_page(
				'vinilart-sport',
				$title . ' — ' . __( 'VinilArt Sport', 'vinilart-sport' ),
				$title,
				'manage_options',
				$slug,
				function () use ( $title, $slug ) {
					vinilart_sport_render_admin_placeholder( $title, $slug );
				}
			);
		}
	}
}
add_action( 'admin_menu', 'vinilart_sport_add_admin_menu' );

if ( ! function_exists( 'vinilart_sport_render_admin_dashboard' ) ) {
	/**
	 * Renderiza a página de visão geral/estado técnico do tema no wp-admin.
	 */
	function vinilart_sport_render_admin_dashboard() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$manifest = vinilart_sport_get_asset_manifest();
		$has_js   = ! empty( $manifest['entry_js'] );
		$has_css  = ! empty( $manifest['entry_css'] );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'VinilArt Sport — Painel de Controlo', 'vinilart-sport' ); ?></h1>
			<p class="description">
				<?php esc_html_e( 'Fundação técnica do tema instalada e pronta para integração com a plataforma.', 'vinilart-sport' ); ?>
			</p>

			<div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
				<div style="background: #fff; border: 1px solid #ccd0d4; padding: 18px 24px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.04);">
					<h3 style="margin-top: 0;"><?php esc_html_e( 'Estado dos Assets do Frontend', 'vinilart-sport' ); ?></h3>
					<p><strong><?php esc_html_e( 'Versão do Tema:', 'vinilart-sport' ); ?></strong> <?php echo esc_html( VINILART_SPORT_VERSION ); ?></p>
					<p>
						<strong><?php esc_html_e( 'Bundle JS:', 'vinilart-sport' ); ?></strong>
						<?php if ( $has_js ) : ?>
							<span style="color: #46b450;">✔ <?php echo esc_html( basename( $manifest['entry_js'] ) ); ?></span>
						<?php else : ?>
							<span style="color: #dc3232;">✖ <?php esc_html_e( 'Não detetado (executar build/sync)', 'vinilart-sport' ); ?></span>
						<?php endif; ?>
					</p>
					<p>
						<strong><?php esc_html_e( 'Bundle CSS:', 'vinilart-sport' ); ?></strong>
						<?php if ( $has_css ) : ?>
							<span style="color: #46b450;">✔ <?php echo esc_html( basename( $manifest['entry_css'] ) ); ?></span>
						<?php else : ?>
							<span style="color: #dc3232;">✖ <?php esc_html_e( 'Não detetado (executar build/sync)', 'vinilart-sport' ); ?></span>
						<?php endif; ?>
					</p>
				</div>

				<div style="background: #fff; border: 1px solid #ccd0d4; padding: 18px 24px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.04);">
					<h3 style="margin-top: 0;"><?php esc_html_e( 'API REST', 'vinilart-sport' ); ?></h3>
					<p><strong><?php esc_html_e( 'Namespace:', 'vinilart-sport' ); ?></strong> <code>vinilart-sport/v1</code></p>
					<p>
						<strong><?php esc_html_e( 'Endpoint Health:', 'vinilart-sport' ); ?></strong>
						<a href="<?php echo esc_url( rest_url( 'vinilart-sport/v1/health' ) ); ?>" target="_blank" rel="noopener noreferrer">
							/wp-json/vinilart-sport/v1/health
						</a>
					</p>
				</div>

				<div style="background: #fff; border: 1px solid #ccd0d4; padding: 18px 24px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.04);">
					<h3 style="margin-top: 0;"><?php esc_html_e( 'Estrutura de Fases', 'vinilart-sport' ); ?></h3>
					<ul style="margin: 0; padding-left: 18px; line-height: 1.8;">
						<li><strong style="color: #46b450;">✔ Fase 1:</strong> <?php esc_html_e( 'Fundação do Tema & Enqueue Dinâmico', 'vinilart-sport' ); ?></li>
						<li><strong style="color: #72777c;">⏳ Fase 2:</strong> <?php esc_html_e( 'Modelos de Dados & REST API', 'vinilart-sport' ); ?></li>
						<li><strong style="color: #72777c;">⏳ Fase 3:</strong> <?php esc_html_e( 'Ligação Repositories ao WordPress', 'vinilart-sport' ); ?></li>
					</ul>
				</div>
			</div>

			<div style="margin-top: 30px;">
				<hr />
				<h3><?php esc_html_e( 'Ferramentas do Sistema', 'vinilart-sport' ); ?></h3>
				<?php if ( isset( $_GET['seeded'] ) && '1' === $_GET['seeded'] ) : ?>
					<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Catálogo importado com sucesso!', 'vinilart-sport' ); ?></p></div>
				<?php endif; ?>
				<p><?php esc_html_e( 'Importar o catálogo atual em ficheiros locais para a base de dados do WordPress. (Idempotente, não duplica)', 'vinilart-sport' ); ?></p>
				<a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin.php?page=vinilart-sport&vinilart_seed_catalog=1' ), 'seed_catalog' ) ); ?>" class="button button-secondary">
					<?php esc_html_e( 'Importar Catálogo Base', 'vinilart-sport' ); ?>
				</a>
			</div>
		</div>
		<?php
	}
}

if ( ! function_exists( 'vinilart_sport_render_admin_placeholder' ) ) {
	/**
	 * Renderiza placeholder limpo para submenus ainda em desenvolvimento nas próximas fases.
	 *
	 * @param string $title Título da secção.
	 * @param string $slug  Slug da secção.
	 */
	function vinilart_sport_render_admin_placeholder( $title, $slug ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $title ); ?></h1>
			<div class="notice notice-info inline" style="margin-top: 15px;">
				<p>
					<?php
					printf(
						/* translators: %s: Nome da secção */
						esc_html__( 'O módulo %s está configurado na arquitetura do tema e será conectado nas fases subsequentes de integração de dados.', 'vinilart-sport' ),
						'<strong>' . esc_html( $title ) . '</strong>'
					);
					?>
				</p>
			</div>
		</div>
		<?php
	}
}
