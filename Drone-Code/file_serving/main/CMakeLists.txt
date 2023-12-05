idf_component_register(SRCS "nmea_parser.c"  "main.c" "file_server.c" "mount.c" "gps_spiffs.c"
                    INCLUDE_DIRS "." "include"
                    EMBED_FILES "favicon.ico" "upload_script.html")
