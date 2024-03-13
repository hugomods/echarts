{{- range $k, $v := . }}
  {{ printf "window.%s = (() => { %s })();" $k $v | safeJS }}
{{- end }}
