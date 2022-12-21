#!/bin/bash

# Set the source directory
src_dir="./src"

# Set the destination directory
dest_dir="./"

# Use rsync to copy the files and directories from the source to the destination
rsync -av --exclude '*.ts' $src_dir/ $dest_dir/
