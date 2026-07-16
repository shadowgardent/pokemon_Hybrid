import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import PokemonCard from '@/components/PokemonCard';
import EmptyState from '@/components/EmptyState';
import {
  POKEAPI_BASE_URL,
  getPokemonImageUrl,
  TYPE_NAMES_TH,
  TYPE_COLORS,
  PokemonListItem,
} from '@/constants/Pokemon';

export default function TypeFilterScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const typeName = TYPE_NAMES_TH[type || ''] || type || '';
  const typeColor = TYPE_COLORS[type || ''] || '#FFCB05';

  useEffect(() => {
    const fetchTypePokemons = async () => {
      try {
        const res = await fetch(`${POKEAPI_BASE_URL}/type/${type}`);
        const data = await res.json();

        const list: PokemonListItem[] = data.pokemon
          .map((entry: { pokemon: { name: string; url: string } }) => {
            const urlParts = entry.pokemon.url.split('/').filter(Boolean);
            const id = Number(urlParts[urlParts.length - 1]);
            if (id > 905) return null;
            return {
              id,
              name: entry.pokemon.name,
              url: entry.pokemon.url,
              types: [type || ''],
              image: getPokemonImageUrl(id),
            };
          })
          .filter(Boolean)
          .sort((a: PokemonListItem, b: PokemonListItem) => a.id - b.id);

        setPokemonList(list);
      } catch (error) {
        console.error('Failed to fetch type Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchTypePokemons();
    }
  }, [type]);

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard
        pokemon={item}
        onPress={() => router.push(`/pokemon/${item.id}`)}
      />
    ),
    [router]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={typeColor} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `ชนิด ${typeName}`,
          headerStyle: { backgroundColor: '#0F1F3D' },
          headerTintColor: '#FFCB05',
          headerTitleStyle: { fontWeight: '800', color: '#FFCB05' },
        }}
      />
      <View style={styles.container}>
        {pokemonList.length === 0 ? (
          <EmptyState
            title="ไม่พบโปเกมอน"
            message={`ไม่พบโปเกมอนประเภท${typeName}`}
            icon="alert-circle-outline"
          />
        ) : (
          <FlatList
            data={pokemonList}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1929',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1929',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});
