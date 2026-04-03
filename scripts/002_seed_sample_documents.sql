-- Script para inserir documentos de exemplo na base de conhecimento do SOFIA
-- NOTA: Os embeddings precisam ser gerados via API (text-embedding-3-small) em um script separado

INSERT INTO documents (source_title, source_type, content, article_number) VALUES

-- Lei 11.440/2006 - Plano de Carreira
('Lei 11.440/2006 - Plano de Carreira dos Cargos do Serviço Exterior Brasileiro',
 'lei',
 'A carreira de Oficial de Chancelaria é integrante do Serviço Exterior Brasileiro, regida pela Lei 11.440 de 29 de dezembro de 2006. Os Oficiais de Chancelaria exercem atividades de natureza técnica e administrativa de apoio à carreira de Diplomata, nos termos do regulamento.',
 'Art. 1º'),

('Lei 11.440/2006 - Estrutura da Carreira de Oficial de Chancelaria',
 'lei',
 'A carreira de Oficial de Chancelaria é estruturada em três classes: Terceira Classe, Segunda Classe e Primeira Classe. O ingresso na carreira ocorre na Terceira Classe, mediante aprovação em concurso público de provas ou de provas e títulos. A promoção entre as classes observa os critérios de merecimento e antiguidade.',
 'Arts. 8º e 9º'),

('Lei 11.440/2006 - Promoção por Merecimento',
 'lei',
 'A promoção por merecimento far-se-á mediante apuração do mérito do servidor, levando-se em conta: I - avaliação de desempenho; II - participação em cursos de aperfeiçoamento; III - tempo de efetivo exercício no exterior; IV - outras atividades relevantes para a carreira. O processo de promoção é conduzido pela Comissão de Promoções.',
 'Art. 10'),

('Lei 11.440/2006 - Remoção para o Exterior',
 'lei',
 'A remoção de Oficial de Chancelaria para posto no exterior far-se-á por indicação do Ministério das Relações Exteriores, observados os requisitos de antiguidade, merecimento e as necessidades do serviço. O tempo mínimo de permanência em cada posto será definido em regulamento, não podendo ser inferior a dois anos nem superior a quatro anos.',
 'Art. 15'),

-- Direitos e Benefícios
('Lei 11.440/2006 - Adicional de Serviço no Exterior',
 'lei',
 'O Oficial de Chancelaria em serviço no exterior faz jus ao Adicional de Serviço Exterior, calculado com base na retribuição básica do servidor e nos índices de custo de vida e representação de cada posto. O adicional é pago em moeda estrangeira e não se incorpora aos vencimentos para fins de aposentadoria.',
 'Art. 22'),

('Lei 8.112/1990 - Licença para Capacitação',
 'lei',
 'Após cada quinquênio de efetivo exercício, o Oficial de Chancelaria poderá, no interesse da Administração, afastar-se do exercício do cargo efetivo, com a respectiva remuneração, por até três meses, para participar de curso de capacitação profissional. O requerimento deve ser apresentado com antecedência mínima de 60 dias.',
 'Art. 87'),

('Decreto - Auxílio Moradia no Exterior',
 'decreto',
 'O Oficial de Chancelaria servindo no exterior tem direito ao auxílio-moradia quando não houver imóvel funcional disponível. O valor do auxílio é definido por ato do Ministro de Estado das Relações Exteriores, considerando o custo de locação no mercado local.',
 NULL),

-- Deveres e Procedimentos
('Lei 8.112/1990 - Sigilo Funcional',
 'lei',
 'É dever do Oficial de Chancelaria guardar sigilo sobre assuntos da repartição, especialmente os de natureza confidencial ou relativos à segurança do Estado e da Administração Pública. A violação do dever de sigilo constitui infração disciplinar grave, podendo resultar em demissão.',
 'Art. 116, VIII'),

('Portaria MRE - Requisitos para Promoção',
 'portaria',
 'Para concorrer à promoção, o Oficial de Chancelaria deve: I - contar com interstício mínimo de três anos na classe; II - não ter sofrido penalidade disciplinar nos últimos dois anos; III - ter conceito favorável nas avaliações de desempenho; IV - ter participado de pelo menos um curso de aperfeiçoamento oferecido pelo Instituto Rio Branco.',
 NULL),

('Portaria MRE - Procedimento de Remoção',
 'portaria',
 'O processo de remoção para posto no exterior inicia-se com a abertura de edital pela Divisão de Pessoal. O Oficial de Chancelaria interessado deve manifestar interesse por meio de formulário próprio, indicando até cinco postos de preferência. A seleção considera antiguidade, merecimento e perfil do servidor.',
 NULL);
