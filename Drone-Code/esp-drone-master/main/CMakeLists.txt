idf_component_register(SRCS "main.c"
                       INCLUDE_DIRS "."
                       LDFRAGMENTS linker_fragment.lf)
target_compile_options(${COMPONENT_LIB} PRIVATE  -Wno-format)
