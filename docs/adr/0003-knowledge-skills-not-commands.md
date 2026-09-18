# Method ships as knowledge skills, not commands

The user will not remember to call skills and does not want a prototype command (theirs or mattpocock's `/prototype`). The method therefore ships as knowledge skills with `user-invocable: false`, triggered by task description and file paths, so it loads by itself; the only commands are `/devio:setup` and `/devio:next`. Keeping the method in the plugin rather than copying it per repository is what stops it from going stale.
