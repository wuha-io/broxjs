
# Config generator

The goal is to define a configuration unification format of the extension manifest file.

First, we probably need a configuration mapping file which we will use in order to build
from a single configuration file, all the browsers configuration files.

- Each field as a name and a type.
- A field can be required.
- A field can have children fields.
- A field can have a different name for to browsers.
- A field can have a different location for to browsers.

## Example

For instance, let's define a mapping file :

**mapping.json**
```json
{
  "name": {
    "type": "string",
    "required": true,
    "mapping": {
      "chrome": "name",
      "firefox": "ext_name"
    }
  }
}
```

Now, this is the unified configuration file :

**manifest.json**
```json
{
  "name": "My Extension"
}
```

Let's see what configurations files we need for Chrome and Firefox :

**For Chrome**
```json
{
  "name": "My Extension"
}
```

**For Firefox**
```json
{
  "ext_name": "My Extension"
}
```
