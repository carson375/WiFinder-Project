idf_component_register(SRCS "nmea_parser.c" "gps_spiffs.c"
                       INCLUDE_DIRS "." "include"
                       REQUIRES nvs_flash spiffs wifi)