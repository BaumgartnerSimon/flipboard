import summary
import sys

##import threading
##import mongodb
##import config
##import une classe de news?

##start un thread
##get les journaux
##pour chaque journal:
##    le mettre dans la db si il n'y est pas
##    get les headlines et les mettre dans la db

links = ['http://stackoverflow.com/users/76701/ram-rachum',
          'https://flipboard.com/@nationalgeographic/a-new-era-of-human-spaceflight-has-begun-adkgjdo8oakgl1l0',
          'https://www.youtube.com/watch?v=z9uAN6YNkP0',
          'https://en.wikipedia.org/wiki/Osmia_calaminthae'
]

print("Imported mynews!", file=sys.stderr)

for link in links:
    print(f"link: {link}", file=sys.stderr)
    s = summary.Summary(link)
    s.extract()
    print(f"Title: {s.title}", file=sys.stderr)
    print(f"Description: {s.description}", file=sys.stderr)
    print(f"Image: {s.image}", file=sys.stderr)
