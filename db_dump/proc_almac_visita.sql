USE hospital;
DELIMITER $$

DROP PROCEDURE IF EXISTS buscarVisita$$
CREATE PROCEDURE buscarVisita (_id INT)
BEGIN
    SELECT * FROM visita WHERE id_visita = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarVisita$$
CREATE PROCEDURE filtrarVisita (
    _parametros VARCHAR(250), -- %identificacion_visitante%&%identificacion_administrador%&%motivo_visita%&%estado%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED)
BEGIN
    SELECT cadenaFiltro(_parametros, 'identificacion_visitante&identificacion_administrador&motivo_visita&estado&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM visita WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsVisita$$
CREATE PROCEDURE numRegsVisita (
    _parametros VARCHAR(250))
BEGIN
    SELECT cadenaFiltro(_parametros, 'identificacion_visitante&identificacion_administrador&motivo_visita&estado&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id_visita) FROM visita WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevaVisita$$
CREATE FUNCTION nuevaVisita (
    _identificacion_visitante VARCHAR(20),
    _identificacion_administrador VARCHAR(20),
    _motivo_visita VARCHAR(255),
    _fecha_entrada DATETIME,
    _fecha_salida DATETIME,
    _estado ENUM('en curso', 'finalizada')
) RETURNS INT(1)
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(id_visita) INTO _cant FROM visita WHERE identificacion_visitante = _identificacion_visitante AND fecha_entrada = _fecha_entrada;
    IF _cant < 1 THEN
        INSERT INTO visita(identificacion_visitante, identificacion_administrador, motivo_visita, fecha_entrada, fecha_salida, estado)
        VALUES (_identificacion_visitante, _identificacion_administrador, _motivo_visita, _fecha_entrada, _fecha_salida, _estado);
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarVisita$$
CREATE FUNCTION editarVisita (
    _id INT,
    _identificacion_visitante VARCHAR(20),
    _identificacion_administrador VARCHAR(20),
    _motivo_visita VARCHAR(255),
    _fecha_entrada DATETIME,
    _fecha_salida DATETIME,
    _estado ENUM('en curso', 'finalizada')
) RETURNS INT(1)
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    DECLARE no_encontrado INT DEFAULT 0;
    IF NOT EXISTS(SELECT id_visita FROM visita WHERE id_visita = _id) THEN
        SET no_encontrado = 1;
    ELSE
        UPDATE visita SET
            identificacion_visitante = _identificacion_visitante,
            identificacion_administrador = _identificacion_administrador,
            motivo_visita = _motivo_visita,
            fecha_entrada = _fecha_entrada,
            fecha_salida = _fecha_salida,
            estado = _estado
        WHERE id_visita = _id;
    END IF;
    RETURN no_encontrado;
END$$

DROP FUNCTION IF EXISTS eliminarVisita$$
CREATE FUNCTION eliminarVisita (_id INT) RETURNS INT(1)
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    DECLARE _cant INT;
    DECLARE _resp INT;
    SET _resp = 0;
    SELECT COUNT(id_visita) INTO _cant FROM visita WHERE id_visita = _id;
    IF _cant > 0 THEN
        SET _resp = 1;
        DELETE FROM visita WHERE id_visita = _id;
    END IF;
    RETURN _resp;
END$$

DELIMITER ;



DELIMITER $$
DROP PROCEDURE IF EXISTS filtrarfVisita $$
CREATE PROCEDURE filtrarfVisita (
    _parametros VARCHAR(250), -- %identificacion_visitante%&%identificacion_administrador%&%motivo_visita%&%estado%& fecha_entrada'
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED
)
BEGIN
    -- Genera el filtro dinámico
    SELECT cadenaFiltro(_parametros, 'identificacion_visitante&identificacion_administrador&motivo_visita&estado') INTO @filtro;

    -- Arma el SQL dinámico con los JOIN y los campos requeridos
    SELECT CONCAT(
        "SELECT v.id_visita, ",
        "v.identificacion_visitante, ",
        "CONCAT(vis.nombre, ' ', vis.apellido1) AS nombre_completo_visitante, ",
        "v.identificacion_administrador, ",
        "v.motivo_visita, ",
        "v.fecha_entrada, ",
        "v.fecha_salida, ",
        "v.estado ",
        "FROM visita v ",
        "INNER JOIN visitante vis ON v.identificacion_visitante = vis.identificacion ",
        "WHERE ", @filtro, 
        " LIMIT ", _pagina, ", ", _cantRegs
    ) INTO @sql;

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END $$

DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS trg_visita_finalizada$$
CREATE TRIGGER trg_visita_finalizada
BEFORE UPDATE ON visita
FOR EACH ROW
BEGIN
  IF OLD.estado = 'en curso' AND NEW.estado = 'finalizada' THEN
    SET NEW.fecha_salida = NOW();
  END IF;
END $$
DELIMITER ;



-- SELECT nuevaVisita(
--     '77777777',         -- identificacion_visitante
--     '10000001',         -- identificacion_administrador
--     'Entrega de documentos', -- motivo_visita
--     '2025-06-16 08:00:00',  -- fecha_entrada
--     '2025-06-16 09:00:00',  -- fecha_salida
--     'en curso'               -- estado
-- ) AS resultado;


-- INSERT INTO visita (identificacion_visitante, identificacion_administrador, motivo_visita, fecha_entrada, fecha_salida, estado) VALUES
-- ('77777777', '10000001', 'Entrega de documentos', '2025-06-16 08:00:00', '2025-06-16 09:00:00', 'en curso'),
-- ('77777777', '10000002', 'Revisión tratamiento',   '2025-06-17 10:00:00', '2025-06-17 11:00:00', 'finalizada'),
-- ('77777777', '10000003', 'Evaluación laboral',     '2025-06-18 14:00:00', '2025-06-18 15:00:00', 'en curso'),
-- ('88888888', '10000001', 'Autorización procedimiento', '2025-06-19 09:00:00', '2025-06-19 10:00:00', 'en curso'),
-- ('99999999', '10000002', 'Queja médica',           '2025-06-20 11:00:00', '2025-06-20 12:00:00', 'finalizada');

-- CALL filtrarVisita('77777777&&&&', 0, 10);

-- SELECT eliminarVisita(2) AS resultado; sie el resultardo es 1 se elimino

-- SELECT editarVisita(
--     2,                        -- id_visita
--     '77777777',               -- identificacion_visitante
--     '10000002',               -- identificacion_administrador
--     'Motivo editado',         -- motivo_visita (nuevo valor)
--     '2025-06-17 10:00:00',    -- fecha_entrada
--     '2025-06-17 12:00:00',    -- fecha_salida (nuevo valor)
--     'finalizada'                -- estado (nuevo valor)
-- ) AS resultado;