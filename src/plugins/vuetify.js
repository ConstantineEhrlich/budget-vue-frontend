import {VDataTable, VDataTableServer, VDataTableVirtual,} from "vuetify/labs/VDataTable";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import 'vuetify/dist/vuetify.min.css';
import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export function buildVuetify() {
    return createVuetify({
        components: {
            ...components,
            VDataTable,
            VDataTableServer,
            VDataTableVirtual,
        },
        directives: directives,
    });
}
  