-- Update featured surf spots with new locations
UPDATE surf_spots SET 
  name = 'Praia da Leste Oeste',
  city = 'Fortaleza',
  latitude = -3.7200,
  longitude = -38.4900,
  description = 'Pico urbano conhecido por suas ondas consistentes e fácil acesso. Popular entre surfistas locais.'
WHERE name = 'Taíba';

UPDATE surf_spots SET 
  name = 'Pico do Titanzinho',
  city = 'Fortaleza', 
  latitude = -3.7300,
  longitude = -38.4800,
  description = 'Pico técnico com ondas de qualidade, frequentado por surfistas experientes. Conhecido pelas sessões intensas.'
WHERE name = 'Paracuru';

UPDATE surf_spots SET 
  name = 'Pico do Havaizinho',
  city = 'Fortaleza',
  latitude = -3.7100,
  longitude = -38.4700, 
  description = 'Pico clássico de Fortaleza com ondas rápidas e tubulares. Referência no surf cearense.'
WHERE name = 'Icaraí de Amontada';

-- Update timestamps
UPDATE surf_spots SET updated_at = CURRENT_TIMESTAMP;
