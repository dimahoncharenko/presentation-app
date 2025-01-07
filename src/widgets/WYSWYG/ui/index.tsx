"use client";

import { useEditor, EditorContent, UseEditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";

import TextStyle from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { HexColorPicker } from "react-colorful";

import classes from "./classes.module.css";

import { memo, useCallback, useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/shared/ui/common/bricks/context-menu";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/ui/common/bricks/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { FontSize } from "../lib/FontSizeExtension";
import { cn } from "@/shared/lib/cn-merge";
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";

import { Button } from "@/shared/ui/common/aceternity/Button";
import { useDebounceValue } from "usehooks-ts";
import { ColorPicker } from "./ColorPicker";

const extensions = [
  StarterKit,
  Color,
  FontFamily,
  UnderlineExtension,
  FontSize,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle.configure({ mergeNestedSpanStyles: true }),
];

type Props = {
  content: string;
  onChange: (content: string) => void;
} & Partial<UseEditorOptions>;

export const WYSWYG = memo(({ content, onChange, ...editorProps }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    ...editorProps,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <ContextMenu modal>
      <ContextMenuTrigger>
        <EditorContent className={classes.editor} editor={editor} />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Colors</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem className="flex-col ">
              {editor && <ColorPicker editor={editor} />}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem inset>
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              value="bold"
              aria-label="Toggle bold"
              onMouseDownCapture={() => editor?.commands.toggleBold()}
              className={cn(
                editor?.isActive("bold") && "bg-black bg-opacity-5"
              )}
            >
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              aria-label="Toggle italic"
              onMouseDownCapture={() => {
                editor?.commands.toggleItalic();
              }}
              className={cn(
                editor?.isActive("italic") && "bg-black bg-opacity-5"
              )}
            >
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="underline"
              aria-label="Toggle underline"
              onMouseDownCapture={() => {
                editor?.commands.toggleUnderline();
              }}
              className={cn(
                editor?.isActive("underline") && "bg-black bg-opacity-5"
              )}
            >
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Fonts</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily("Arial");
              }}
            >
              Arial
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily("monospace");
              }}
            >
              Monospace
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily("cursive");
              }}
            >
              Cursive
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily("fantasy");
              }}
            >
              Fantasy
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily("sans-serif");
              }}
            >
              Sans Serif
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily("Geist Mono");
              }}
            >
              Geist Mono
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem>
          <ToggleGroup
            defaultValue="left"
            type="single"
            value={editor?.getAttributes("paragraph").textAlign}
            onValueChange={(value) => {
              switch (value) {
                case "left":
                  editor?.commands.setTextAlign("left");
                  break;
                case "center":
                  editor?.commands.setTextAlign("center");
                  break;
                case "right":
                  editor?.commands.setTextAlign("right");
                  break;
                case "justify":
                  editor?.commands.setTextAlign("justify");
                  break;
                default:
                  break;
              }
            }}
          >
            <ToggleGroupItem
              value="left"
              aria-label="Align to the left"
              className={cn(
                editor?.isActive({ textAlign: "left" }) && "bg-black"
              )}
            >
              <IconAlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align to center">
              <IconAlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align to the right">
              <IconAlignRight className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify" aria-label="Align justified">
              <IconAlignJustified className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});
