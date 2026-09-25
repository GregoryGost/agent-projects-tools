# Official Blender Lab MCP 1.0.3 Tool Surface

The official server is deliberately small. The v1.0.3 line exposes 26 tools in these groups.

## Code execution

- `execute_blender_code`
- `execute_blender_code_for_cli`

## Blend-file summaries

- `get_blendfile_summary_datablocks`
- `get_blendfile_summary_datablocks_for_cli`
- `get_blendfile_summary_missing_files`
- `get_blendfile_summary_missing_files_for_cli`
- `get_blendfile_summary_of_linked_libraries`
- `get_blendfile_summary_of_linked_libraries_for_cli`
- `get_blendfile_summary_path_info`
- `get_blendfile_summary_path_info_for_cli`
- `get_blendfile_summary_usage_guess`
- `get_blendfile_summary_usage_guess_for_cli`

## Object inspection

- `get_objects_summary`
- `get_object_detail_summary`

## Documentation

- `get_python_api_docs`
- `search_api_docs`
- `search_manual_docs`

## Screenshots / UI layout

- `get_screenshot_of_area_as_image`
- `get_screenshot_of_window_as_image`
- `get_screenshot_of_window_as_json`

## Navigation

- `jump_to_tab_by_name`
- `jump_to_tab_by_space_type`
- `jump_to_view3d_object_by_name`
- `jump_to_view3d_object_data_by_name`

## Rendering

- `render_thumbnail_to_path`
- `render_viewport_to_path`

## Implication for authoring

There is no complete typed CRUD/mutation surface for mesh/material/rig/animation authoring.

Therefore:

- use dedicated tools for inspection/docs/screenshots/navigation where appropriate;
- use bounded `execute_blender_code` + Blender APIs for actual complex authoring;
- re-discover the live tool catalog for newer MCP versions rather than freezing this list forever.

## Side-effect caution

Tool annotations are hints, not a replacement for request routing. For example, a tool that renders "to path" writes a file even if an annotation suggests read-only behavior.

Classify the real operation.
